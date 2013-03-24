# thearcbot

the arcbot does the following:
- Notifies IRC channel of git commits (using the post-receive hook)
	- This happens asynchronously to avoid slow git pushes
- "That's what she said", uses the awesome `twss` node module to, well, troll.
- Greets returning users

## Usage Instructions
- Move `post-receive` to `/path/to/repository/hooks/`
- Change Constants in `app.js`
	- BOT_NICK
		- bot's nick
	- CHANNEL
		- Channel that thearcbot is subscribed to
	- NICKS
		- key-value pair of names and IRC nicks to trigger IRC notification
	- MSGES
		- An array of greetings