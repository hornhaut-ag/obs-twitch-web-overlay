$(function() {
	Twitch.init({clientId: twitchClientId}, function(error, status) {
		if (status.authenticated) {
			$('.twitch-connect').remove();

			var options = {
				strokeWidth: 8,
				easing: 'easeInOutQuad',
				duration: 0,
				color: '#121212',
				trailColor: '#090909',
				trailWidth: 4,
				svgStyle: {width: '100%', height: '100%', background: '#000', outline: '1px solid #333'}
			};

			// Follower bar
			var followerBar = new ProgressBar.Line('#follower-bar', options);

			// Check followers in 30 secs interval
			fetchFollowerCount(followerBar);
			setInterval(function() {
				fetchFollowerCount(followerBar);
			}, 30000);

			// Subs bar
			var subBar = new ProgressBar.Line('#subs-bar', options);

			// Check followers in 30 secs interval
			fetchSubsCount(subBar);
			setInterval(function() {
				fetchSubsCount(subBar);
			}, 30000);
		}

	});

	$('.twitch-connect').click(function() {
		Twitch.login({
			scope: ['user_read', 'channel_read', 'channel_subscriptions']
		});
	});
});

function fetchFollowerCount(followerBar) {
	var followerCurr = 0;
    Twitch.api({method: 'channel'}, function(error, channel) {
        console.log(channel.followers);
        followerCurr = channel.followers;
        $('#follower-current').text(followerCurr);
		var followerGoal = $('#follower-goal').text();
		var fQuota = followerCurr/followerGoal;
		followerBar.animate(fQuota);
    });
}

function fetchSubsCount(subsBar) {
	var subsCurr = 0;
    Twitch.api({method: 'channels/neobaldhornrich/subscriptions'}, function(error, subscriptions) {
        console.log(subscriptions._total);
        subsCurr = subscriptions._total - 1;
        $('#subs-current').text(subsCurr);
		var subsGoal = $('#subs-goal').text();
		var sQuota = subsCurr/subsGoal;
		subsBar.animate(sQuota);
    });
}