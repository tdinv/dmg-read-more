# Welcome to the DMG Read More Plugin!

This plugin not only creates a nice 'Anchor Link' WordPress Gutenberg block, but it also registers a custom WP_CLI command to return posts containing the custom block.


## The Block
Once the 'Anchor Link' block is selected, you will be prompted to select a post from the inspectorControls within the sidebar. By default the latest posts will display allowing for quick selection. You can search for a post by it's *post_title*, or you can enter the post ID (*if you know it of course*) and it will return the post, if it exists.

This plugin is lightweight and commented so that you know what it's doing and why.

## The Command

The command `wp dmg-read-more-search` is registered and once run will return posts from the last 30 days which contain the new block within the *post_content*. It does this by searching against *post_content* for the first part of the block which is saved within the database itself, it doesn't search by class name or html element as these may not be unique identifiers.

### Command Arguments
Associated Arguments can be passed to the command to change the date range in which we want to return results for:

 - `--date-before="Y-m-d"` The before date accepts a Accepts `strtotime()` compatible string. If no argument is passed, it will default to todays date.
 - `--date-after="Y-m-d"` The before date accepts a Accepts `strtotime()` compatible string.
 - `--save-as-csv` This argument will flag that we want to save the results to a CSV, this is an added feature as it's nice to have!

Enjoy!