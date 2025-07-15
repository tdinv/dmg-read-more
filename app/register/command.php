<?php

/**
 * Command
 *
 * Adds/regsiters the custom CLI command
 *
 * PHP Version 8
 *
 * @category Register
 * @package  DMGReadMore
 * @license  http://www.gnu.org/copyleft/gpl.html GNU General Public License
 */


if (defined('WP_CLI') && WP_CLI) {

    /**
     * DMG Read More Search Command
     *
     * Usage: wp dmg-read-more-search --date-before= --date-after=
     *
     * Example: wp dmg-read-more-search --date-before="2025-07-09"  --date-after="2025-07-01"
     * Example: wp dmg-read-more-search --date-before="2025-07-10"
     * 
     * Date is in Y-m-d format, if no date is applied, it will return results for the last 30 days from today
     * 
     * @param  array $args
     * @param  array $assoc_args 
     *
     * @return log
     */
    function dmg_read_more_search($args, $assoc_args){

        global $wpdb;

        // This will be incremented once posts have been found per query result
        $totalFound = 0;
        $foundIDs = [];
        $datesOmmitted = false;

        if(!isset($assoc_args['date-before']) && !isset($assoc_args['date-after'])){
            $datesOmmitted = true;
        }

        // Lets determine what dates we need to use
        // Setup before date, will set to be today if no date is set just to keep the wp_query logic light
        $before_date = isset($assoc_args['date-before']) ? $assoc_args['date-before'] : date('Y-m-d', current_time('timestamp'));
        // Setup after date, if not set then it will be set to 30 days ago
        $after_date = isset($assoc_args['date-after']) ? $assoc_args['date-after'] : date('Y-m-d', strtotime('-30 days', current_time('timestamp')));
        // Pagination is needed as we will need to take into account multiple pages of thousands of results
        $pagination = 1;

        // Setting up default wp_query arguments to be used, we don't need to change this everytime a query is ran other than the pagination
        $query_arguments = [
            'post_type' => 'post',
            'posts_per_page' => 1000, // We may be looking through millions of posts, so lets add some pagination and limit them to a good number per page
            's' => '<!-- wp:dmg/read-more ', // Specific block name, not any html as the html itself could change
            'search_columns' => 'post_content', // Look only in the post_content for the search term
            'date_query' => [
                'before' => $before_date, // This is either today or a date specified
                'after' => $after_date, // This will either be a date or 30 days ago
                'inclusive' => true // We want to include posts on these days as well, not just between
            ],
            'fields' => 'ids' // Only return ids
        ];

        if($datesOmmitted){
            WP_CLI::log('Attempting to look for posts within the last 30 days, IDs will show below if any posts are found...');
            WP_CLI::log('');
        } else {
            WP_CLI::log('Attempting to look for posts within date range (Before: '. $before_date .' After: '. $after_date .'), IDs will show below if any posts are found...');
            WP_CLI::log('');
        }

        // This will run whilst we are always before the max number of pages which we get from the first query
        do {

            try {

                // Let's run the actual query, if we error at any point, it will abort the mission

                // Set the query to include the pagination we are on
                $query_arguments['paged'] = $pagination;
                
                $query = new WP_Query($query_arguments);

                if($query->have_posts()){

                    // Lets update the total number of posts we have find
                    $totalFound += count($query->posts);

                    // Lets loop them and output them
                    foreach ($query->posts as $post) {
                        WP_CLI::log($post);
                        // Add them to a list of foundIDs as we may need it later
                        $foundIDs[] = $post;
                    }

                } else { 

                    // We have no posts from this query, a message doesn't need to be logged here as we haven't updated the totalFound
                    break;

                }

                wp_reset_postdata();


            } catch (Exception $e) {

                WP_CLI::warning('Ooops! An Error occured, you may want to try again... ' . $e->getMessage());

            }

            // Increment which page we are on so we can return more results until the max_num_pages is hit
            $pagination++;

        } while ($pagination <= $query->max_num_pages);

        if($totalFound === 0){

            WP_CLI::log('No posts were found.');

        } else {

            WP_CLI::log('');
            WP_CLI::log('Command was run and a total of '. $totalFound .' post(s) were found.');

            // If we found posts, we may want to save them to a csv
            if(isset($assoc_args['save-to-csv'])){

                WP_CLI::log('Creating CSV...');

                $fp = fopen('found-read-more-post-ids-'.time().'.csv', 'w');

                foreach ($foundIDs as $id) {
                    fputcsv($fp, [$id], ',', '"', '');
                }

                fclose($fp);

                WP_CLI::log('CSV Created.');

            }

        }

        WP_CLI::success('Command Run Complete... have a nice day!');

        return;

    }

    WP_CLI::add_command('dmg-read-more-search', 'dmg_read_more_search');
    
}