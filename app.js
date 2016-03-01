$(document).ready(function(){
	$('#all-tweets').on('click', function(e) {
		$.ajax({
			url: "/api/tweets",
			success: function(response) {
				var parsed = JSON.parse(response)
				var html = '';
				for (var i = 0; i < parsed.length; i++) {
					html += '<div><p>' + 'Tweet ID: ' + parsed[i].id +'<br/>Created_at: ' + parsed[i].created_at +
							'<br/>Text: '+ parsed[i].text +'</p></div>'
					if (i != parsed.length -1 ) {
						html += '<hr/>'
					}
				}
				$('#display-box').html(html);
			}
		});
	});

	$('#all-users').on('click', function(e) {
		$.ajax({
			url: "/api/users",
			success: function(response) {
				var parsed = JSON.parse(response)
				var html = '';
				for (var i = 0; i < parsed.length; i++) {
					html += '<div><p>'
					if (parsed[i].name) {
						html+='Name: '+ parsed[i].name +'<br/>';
					}
					if (parsed[i].screen_name) {
						html+='Screen name: '+ parsed[i].screen_name +'<br/>';
					}
					if (parsed[i].location) {
						html+='Location: '+ parsed[i].location +'<br/>';
					}
					if (parsed[i].description) {
						html+='Description: '+ parsed[i].description +'<br/>';
					}
					if (parsed[i].url) {
						html+='Url: '+ parsed[i].url +'<br/>';
					}
					if (parsed[i].id) {
						html+='User ID: '+ parsed[i].id +'<br/>';
					}
					html += '</p></div>';
					if (i != parsed.length -1 ) {
						html += '<hr/>'
					}
				}
				$('#display-box').html(html);
			}
		});
	});

	$('#all-links').on('click', function(e) {
		$.ajax({
			url: "/api/external_links",
			success: function(response) {
				var parsed = JSON.parse(response)
				var html = '';
				for (var i = 0; i < parsed.length; i++) {
					html += '<div><p>'
					html += 'Tweet ID: ' + parsed[i].id + '<br/>';
					html += 'Links: '
					for (var j=0; j<parsed[i].links.length-1; j++) {
						html += parsed[i].links[j] + '<br/>'
					}
					html += '</p></div>';
					if (i != parsed.length -1 ) {
						html += '<hr/>'
					}
				}
				$('#display-box').html(html);
			}
		});
	});

	$('#get-tweet-info').on('click', function(e) {
		if ($('#tweet-id').val()) {
			$.ajax({
				url: "/api/tweet",
				data: {
					'id': $('#tweet-id').val()
				},
				success: function(response) {
					var parsed = JSON.parse(response)
					var html = '';
					if (parsed.length > 0) {
						for (var i=0; i<parsed.length; i++) {
							html += '<div><p>' + 'ID: ' + parsed[i].id +'<br/>Created_at: ' + parsed[i].created_at +
								'<br/>text: '+ parsed[i].text +'</p></div>'
						}
					}
					else {
						html = '<div class="message">We couldn&#39;t find anything for Tweet ID: ' + $('#tweet-id').val() + '</div>';
					}
					$('#display-box').html(html);
				}
			});
		};
	});

	$('#get-user-info').on('click', function(e) {
		if ($('#user-name').val()) {
			$.ajax({
				url: "/api/user",
				data: {
					'name': $('#user-name').val()
				},
				success: function(response) {
					var parsed = JSON.parse(response)
					var html = '';
					if (parsed.length > 0) {
						for (var i=0; i<parsed.length; i++) {
							html += '<div><p>'
							if (parsed[i].name) {
								html+='Name: '+ parsed[i].name +'<br/>';
							}
							if (parsed[i].screen_name) {
								html+='Screen name: '+ parsed[i].screen_name +'<br/>';
							}
							if (parsed[i].location) {
								html+='Location: '+ parsed[i].location +'<br/>';
							}
							if (parsed[i].description) {
								html+='Description: '+ parsed[i].description +'<br/>';
							}
							if (parsed[i].url) {
								html+='Url: '+ parsed[i].url +'<br/>';
							}
							if (parsed[i].id) {
								html+='User ID: '+ parsed[i].id +'<br/>';
							}
							html += '</p></div>';
						}
					}
					else {
						html = '<div class="message">We couldn&#39;t find anything for User name: ' + $('#user-name').val() + '</div>';
					}
					$('#display-box').html(html);
				}
			});
		}
	});

});