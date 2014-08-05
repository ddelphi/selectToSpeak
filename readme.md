
# readme

## overview

This is a simple bookmarklet script for text to speech with the japanese words.

The script uses google translate service for getting the voice audio, and then play it in the background.

## requirement

Although the google translate tts api is public, but it will reject the request if the request header's referer has any words.

So, this script using a trick to use the api without using a backend service.

~~The requirement is:~~

* a google Chrome browser (which can play audio directly)

## usage

At first, you should create a new bookmark in your bookmark bar, and fill the url section with the content of the file bookmarklet.js.

Second, click the new bookmark on a page to load the script.

Then, select the japanese words, and press the key `shift` to let the script read them out loud.

## limitation

[1]
The length of selected words should not more than 30.

