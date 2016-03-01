// These following variables are used for pagination.
var page = 0; // page number 
var type = null; // 0 for tweet, 1 for user, and 2 for external link
var display_data = ""; // save the response data 

$(document).ready(function(){
	
	// Send a HTTP request to get all tweets information
	$('#all-tweets').on('click', function(e) {
		$.ajax({
			url: "/api/tweets",
			success: function(response) {
				page = 0;
				type = 0;
				display_data = response;
				var html = parse_tweet(response, null, page);
				$('#display').html(html);
			}
		});
	});

	// Send a HTTP request to get all user information
	$('#all-users').on('click', function(e) {
		$.ajax({
			url: "/api/users",
			success: function(response) {
				page = 0;
				type = 1;
				display_data = response;
				var html = parse_user(response, null, page);
				$('#display').html(html);
			}
		});
	});

	// Send a HTTP request to get all external links
	$('#all-links').on('click', function(e) {
		$.ajax({
			url: "/api/external_links",
			success: function(response) {
				page = 0;
				type = 2;
				display_data = response;
				var html = parse_link(response, page);
				$('#display').html(html);
			}
		});
	});

	// Send a HTTP request with parameter tweet id to get specific tweet infomation
	$('#get-tweet-info').on('click', function(e) {
		// Send the request only when there's input
		if ($('#tweet-id').val()) {
			$.ajax({
				url: "/api/tweet",
				data: {
					'id': $('#tweet-id').val().trim()
				},
				success: function(response) {
					var html = parse_tweet(response, $('#tweet-id').val(), 0)
					$('#display').html(html);
				}
			});
		}
		else {
			// The input field is empty
			$('#display').html('<div class="message">Please enter tweet ID to retrieve information</div>');
		}
	});

	$('#get-user-info').on('click', function(e) {
		// Send the request only when there's input
		if ($('#user-name').val()) {
			$.ajax({
				url: "/api/user",
				data: {
					'name': $('#user-name').val().trim()
				},
				success: function(response) {
					var html = parse_user(response, $('#user-name').val(), 0)
					$('#display').html(html);
				}
			});
		}
		else {
			// The input field is empty
			$('#display').html('<div class="message">Please enter user screen name to retrieve information</div>');
		}
	});

	// Change the display data to previous page
	$('#prev-btn').on('click', function(e) {
		page -= 1;
		switch (type) {
			case 0:
				var html = parse_tweet(display_data, null, page);
				$('#display').html(html);
				break;
			case 1:
				var html = parse_user(display_data, null, page);
				$('#display').html(html);
				break;
			default:
				var html = parse_link(display_data, page);
				$('#display').html(html);

		}
	});

	// Change the display data to next page
	$('#next-btn').on('click', function(e) {
		page += 1;
		switch (type) {
			case 0:
				var html = parse_tweet(display_data, null, page);
				$('#display').html(html);
				break;
			case 1:
				var html = parse_user(display_data, null, page);
				$('#display').html(html);
				break;
			default:
				var html = parse_link(display_data, page);
				$('#display').html(html);
		}
	});

});

// This function will parse the tweet information in JSON and return a html string.
function parse_tweet(tweet_info, id, page_num) {
	var parsed = JSON.parse(tweet_info)
	var html = '';
	if (!id) {
		// only do pagination for all tweets option
		parsed = pagination(parsed, page_num);
	}
	else {
		hideNextBtn();
		hidePrevBtn();
	}

	if (parsed.length > 0) {
		for (var i = 0; i < parsed.length; i++) {
			html += '<div><p>' + 
					'<strong>Tweet ID</strong>: ' + parsed[i].id +
					'<br/><strong>Created_at</strong>: ' + parsed[i].created_at +
					'<br/><strong>Text</strong>: '+ parsed[i].text 
			if (id) {
				html += '<br/><strong>User ID</strong>: ' + parsed[i].user_id +
						'<br/><strong>User Screen Name</strong>: ' + parsed[i].user_screen_name
			}
			html += '</p></div>'
			if (i != parsed.length -1 ) {
				html += '<hr/>'
			}
		}
	}
	else {
		if (id) {
			html = '<div class="message">We couldn&#39;t find anything for tweet ID: ' + id + '</div>';
		}
		else {
			html = '<div class="message">We couldn&#39;t find any tweet</div>';
		}
	}
	return html;
}

// This function will parse the user information in JSON and return a html string.
function parse_user(user_info, screen_name, page_num) {
	var parsed = JSON.parse(user_info);
	var html = '';
	if (!screen_name) {
		// only do pagination for all user option
		parsed = pagination(parsed, page_num);
	}
	else {
		// hide the buttons since we don't do pagination here.
		hideNextBtn();
		hidePrevBtn();
	}

	if (parsed.length > 0) {
		for (var i = 0; i < parsed.length; i++) {
			html += '<div><p>'
			if (parsed[i].name) {
				html += '<strong>Name</strong>: ' + parsed[i].name +'<br/>';
			}
			if (parsed[i].screen_name) {
				html += '<strong>Screen name</strong>: ' + parsed[i].screen_name + '<br/>';
			}
			if (parsed[i].id) {
				html += '<strong>User ID</strong>: ' + parsed[i].id + '<br/>';
			}
			if (parsed[i].location) {
				html += '<strong>Location</strong>: ' + parsed[i].location + '<br/>';
			}
			if (parsed[i].description) {
				html += '<strong>Description</strong>: ' + parsed[i].description + '<br/>';
			}
			if (parsed[i].url) {
				html +='<strong>Url</strong>: '+ parsed[i].url +'<br/>';
			}
			html += '</p></div>';
			if (i != parsed.length - 1 ) {
				html += '<hr/>'
			}
		}
	}
	else {
		if (screen_name) {
			html = '<div class="message">We couldn&#39;t find anything for user screen name: ' + screen_name + '</div>';
		}
		else {
			html = '<div class="message">We couldn&#39;t find any user.</div>';
		}
	}
	return html;
}

// This function will parse the user information in JSON and return a html string.
function parse_link(link_info, page_num) {
	var parsed = JSON.parse(link_info);
	var html = '';
	parsed = pagination(parsed, page_num);
	if (parsed.length > 0) {
		for (var i = 0; i < parsed.length; i++) {
			html += '<div><p>' +
					'<strong>Tweet ID</strong>: ' + parsed[i].id + '<br/>' + 
					'<strong>Links</strong>: ' +
					'<ul>';
			for (var j = 0; j < parsed[i].links.length; j++) {
				html += '<li>' + parsed[i].links[j] + '</li>'
			}
			html += '</ul></p></div>';
			if (i != parsed.length -1 ) {
				html += '<hr/>'
			}
		}
	}
	else {
		html = '<div class="message">We couldn&#39;t find any Links.</div>';
	}
	return html;
}

// This function replace the data in the parsed array and control the 
// display/hide of the previous and next button.
// Four elements will be displayed on a single page.
function pagination (parsed_json, page_number) {
	var start = page_number * 4
	var end = page_number * 4 + 4;
	var dataArrayLength = parsed_json.length;
	parsed_json = parsed_json.slice(start,end);
	if (end >= dataArrayLength) {
		hideNextBtn();
	}
	else {
		displayNextBtn();
	}

	if (start) {
		displayPrevBtn();
	}
	else {
		hidePrevBtn();
	}
	return parsed_json;
}

// functions to hide or display the previous and next button for pagination
function displayPrevBtn () {
	document.getElementById("prev-btn").style = "display: inline-block";
}

function displayNextBtn () {
	document.getElementById("next-btn").style = "display: inline-block";
}

function hidePrevBtn () {
	document.getElementById("prev-btn").style = "display: none";
}

function hideNextBtn () {
	document.getElementById("next-btn").style = "display: none";
}