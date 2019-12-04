port module Main exposing (..)

import Browser
import Html exposing (Html, text, div, h1, img, section)
import Html.Attributes exposing (src, class)
import Json.Decode as Decode
import Json.Encode as Encode
import Http

port receivedMessage : (Decode.Value -> msg) -> Sub msg
port sendUsername : String -> Cmd msg

type alias Model = {}

type Msg
  = ReceivedMessage Decode.Value

init : () -> (Model, Cmd Msg)
init () =
  ({}, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ReceivedMessage value ->
      (model, Cmd.none)

view : Model -> Html Msg
view model =
  section [ class "section" ]
    [ div [ class "container" ]
      [ h1 [ class "title" ]
        [ text "Your Elm App is working!" ]
      ]
    ]

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ receivedMessage ReceivedMessage ]

main : Program () Model Msg
main =
  Browser.element
    { view = view
    , init = init
    , update = update
    , subscriptions = subscriptions
    }
