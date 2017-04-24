Rails.application.routes.draw do
  root to: 'pages#batch_update'

  scope :api do
    resources :batch_updates, only: :create
  end

  # searches and autocompletes
  get 'match/artworks'
  get 'match/genes'
  get 'match/tags'
  get 'match/fairs'
  get 'match/partners'
end
