/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

// Let's import the data module so that we can access WordPress entities such as pages, posts or CPTs
import { store as coreDataStore } from '@wordpress/core-data';
// import { useEntityRecords } from '@wordpress/core-data'; // We don't need the full store as we are only fetching data not manipulating it

/**
 * Imports the InspectorControls component, which is used to wrap
 * the block's custom controls that will appear in in the Settings
 * Sidebar when the block is selected.
 *
 * Also imports the React hook that is used to mark the block wrapper
 * element. It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#inspectorcontrols
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Imports the necessary components that will be used to create
 * the user interface for the block's settings.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import { PanelBody, SearchControl, MenuGroup, MenuItem, Button, Flex, FlexBlock, Icon } from '@wordpress/components';
import ReactHtmlParser from 'react-html-parser';

/**
 * Imports the useEffect React Hook. This is used to set an attribute when the
 * block is loaded in the Editor.
 *
 * @see https://react.dev/reference/react/useEffect
 */
import { useState, useEffect } from '@wordpress/element'; // We use this instead of useEffect
import { useSelect } from '@wordpress/data';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {

	// Update the block with the classname
	const blockProps = useBlockProps({
		className: 'dmg-read-more',
	});

	const { postSelection } = attributes; // You could simplify this by storing just the link and the title to save DB. For now we will use the entire post object because it's fancy.

	// To determine what is being searched
	const [ toSearch, setToSearch ] = useState(''); // This will get reset once a search/filter term has been applied

	// We need this to load in items to the controls when searching
	const perPageSetting = 8;
	const [ pagination, setPagination ] = useState(1);

	// Some variables needed for UI bits as we need to make the menu items clear
	const [ showingRecent, setShowingRecent ] = useState(true);
	const [ menuGroupHeading, setMenuGroupHeading ] = useState('Recent Posts');

	// Lets create a variable in which we store the posts against, we need to take into account initial load of recent posts and search terms
	const foundPosts = useSelect(
		select => {

			let searchQuery = {
				per_page: perPageSetting,
				page: pagination,
				search: toSearch,
				search_columns: 'post_title' // Only search based on title
			}

			if(toSearch !== '' && !isNaN(toSearch)){ // If we are looking for a particular ID, lets alter the search query
				searchQuery = {
					include: parseInt(toSearch)
				};
			}

			// Return the results we need based on the query
			return select( coreDataStore ).getEntityRecords( 'postType', 'post', searchQuery ); // Acts in the same way an API post request is made
			
		}, [toSearch, pagination]
	);

	// For when a post is selected for adding to the content
	const selectionMade = (post) => {
		setAttributes({
			postSelection: post, // We set this so we can access the entire post data in the view
		});
	};

	// Lets do things when a search is being conducted
	const handleSearch = (inputValue) => {

		if(inputValue !== '' && !isNaN(inputValue)){ // Determine if search is not empty and we are looking for specific ID
			setShowingRecent(false);
			setMenuGroupHeading('Post Found from ID...'); // Set the heading to show that we are searching for a specific ID
		} else if(inputValue == '') { // If not number but value is still blank
			setShowingRecent(true); // We have not conducted a search or the search has been reset so we show recent posts
			setMenuGroupHeading('Recent Posts'); // We need this here if we clear the search value, it will default back to recent posts
		} else { // We are looking for something
			setShowingRecent(false); // We are not showing recent posts now
			setMenuGroupHeading('Results...'); // Set the heading to show what is being displayed
		}

		setPagination(1); // Let's reset the pagination for whenever a new term is searched otherwise it will get stuck with fresh results from a random page
		setToSearch(inputValue); // Set the search value on change
		
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Select/Search', 'dmg-read-more' ) }>
					<SearchControl
						__nextHasNoMarginBottom
						label={ __( 'Search Posts' ) }
						value={ toSearch }
						onChange={ (inputValue) => handleSearch(inputValue) }
						help={ __('You can search by post title, or you can search by the post ID... if you know it! Search results will be shown below') }
					/>
					{ foundPosts &&
						<MenuGroup label={menuGroupHeading}>
							{ foundPosts.map((post) => (
								<MenuItem 
									size="compact"
									className={'dmg-read-more-post' + post.id}
									isSelected={ postSelection && postSelection.id == post.id ? true : false }
									onClick={() => selectionMade(post)}
									>
									{ /* Wrap the item in a p tag for better UI for long title */ }
									<span style={{maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'clip'}}>{ ReactHtmlParser(post.title.rendered) }</span>
								</MenuItem>
							)) }
						</MenuGroup>
					}
					<br/>
					{ 
					/* Buttons allow for more posts to be found as we only fetch a certain number per page. They are only shown based on the condition for better UI */
					(!showingRecent && isNaN(toSearch)) &&
						<Flex justify="space-between" gap={2} >
							<FlexBlock>
								<Button
									variant="tertiary"
									size="small"
									onClick={() => setPagination(pagination - 1)}
									disabled={pagination === 1} // We do not want to move back on initial load
								>
									<Icon icon="arrow-left-alt2"/>
									Back
								</Button>
							</FlexBlock>
							<FlexBlock>
								<Button
									variant="tertiary"
									size="small"
									onClick={() => setPagination(pagination + 1)}
									disabled={(!foundPosts || foundPosts.length < perPageSetting) ? true : false} // We do not want to move forward based on the condition
								>
									More Results
									<Icon icon="arrow-right-alt2"/>
								</Button>
							</FlexBlock>
						</Flex>
					}
				</PanelBody>
			</InspectorControls>
			{
			/* This is what is shown in the editor, the save.js is where the final markup is, render.php is what is shown on the FE */
			postSelection ? (
				<p { ...blockProps }>Read More: <a href={postSelection.link} title={postSelection.title.rendered}>{ReactHtmlParser(postSelection.title.rendered)}</a></p>
			) : (
				<p { ...blockProps }><small>Select or search for a post in the sidebar to add as a 'Read More' link.</small></p>
			)}
		</>
	);
}