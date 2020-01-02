#! /usr/bin/env ruby

require 'rubygems'
require 'bundler'
Bundler.setup(:default, :development)
require 'dotenv/load'
require 'colored2'
require 'date'
require 'aws-sdk-ecr'

# rubocop:disable all

def launch_review_app!
  announce 'Checking namespace and images'
  check_namespace
  clear_ecr_images!

  announce "Setting up review app \"#{review_app_name}\""
  run_command "hokusai review_app setup #{review_app_name}"

  announce 'Pushing image to registry'
  run_command "hokusai registry push --force  --skip-latest --tag #{review_app_name}"

  announce 'Updating yaml config'
  run_command "sed -i '' \"s/rosalind:staging/rosalind:#{review_app_name}/g\" #{yaml_path}"

  announce 'Creating new k8s deployment'
  run_command "hokusai review_app create #{review_app_name}"

  announce 'Copying staging env vars'
  run_command "hokusai review_app env copy #{review_app_name}"
  run_command "hokusai review_app env copy #{review_app_name} --configmap nginx-config"

  announce 'Copying nginx secrets'
  run_command 'kubectl --context staging get secret nginx-secrets -o yaml > nginx-secrets.yml'
  run_command "sed -i '' \"s/namespace: default/namespace: #{review_app_name}/g\" nginx-secrets.yml"
  run_command 'kubectl --context staging apply -f nginx-secrets.yml'
  run_command 'rm nginx-secrets.yml'
  run_command "hokusai review_app refresh #{review_app_name}"

  announce 'Checking for load balancer address'
  hostname = `kubectl --context staging --namespace #{review_app_name} get services -o json | jq -r '.items[0].status.loadBalancer.ingress[0].hostname'`.chomp
  puts "     https://#{hostname}".green.bold

  announce 'Final steps'
  puts "     In a staging Gravity console add the review app's address to the list of permitted OAuth redirect urls:".blue
  puts
  puts '     app = ClientApplication.find_by(name: "Rosalind")'.green
  puts "     app.redirect_urls << \"https://#{hostname}\"".green
  puts '     app.save'.green
  puts
  puts "     Also, be a mensch and clean this review app up when you're done. Here's a reminder to paste into Slack:".blue
  puts
  puts "     /remind me that it's time to `hokusai review_app delete #{review_app_name}` in 7 days".green
end

def review_app_name
  git_status = `git status --porcelain --branch`.chomp
  branch_name = git_status.split(/\n/).first.split('...').first.split.last
  # fully qualify with project name, to make it easier to identify in
  # the k8s dashboard; and hyphenize to match the resulting namespace
  ['rosalind', branch_name].join('_').gsub('_', '-')
end

def yaml_path
  "./hokusai/#{review_app_name}.yml"
end

def check_namespace
  namespaces = JSON.parse(`kubectl --context staging get namespaces -o json`)
  existing_namespace = namespaces['items'].detect { |item| item['metadata']['name'] == 'rosalind-rails-6' }
  return unless existing_namespace

  puts "Found existing namespace \"#{review_app_name}\"".red
  puts 'If this can be safely deleted try:'.red
  puts "hokusai review_app delete #{review_app_name}".red.bold
  exit 1
end

def clear_ecr_images!
  ecr = Aws::ECR::Client.new
  existing_image = ecr.list_images(repository_name: 'rosalind').image_ids.detect { |img| img.image_tag == 'rosalind-rails-6' }
  return unless existing_image

  puts "Found existing ECR image tagged \"#{review_app_name}\"".red
  puts '‣ Deleting image via aws-sdk-ecr...'.cyan
  ecr.batch_delete_image(image_ids: [{ image_tag: review_app_name }], repository_name: 'rosalind')
end

def announce(msg)
  puts msg.blue.bold
end

def run_command(cmd)
  puts ['‣', cmd].join(' ').cyan
  system cmd || raise("Command exited with non-zero status: #{cmd}")
end

launch_review_app!

# rubocop:enable all
