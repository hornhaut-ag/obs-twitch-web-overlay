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
			}, 30000);

			// Subs bar
			var subBar = new ProgressBar.Line('#subs-bar', options);
			fetchSubsCount(subBar);

			// Fetch latest follower
			fetchLatestFollower();

			// Repeat 30 secs interval
			setInterval(function() {
				fetchFollowerCount(followerBar);
				fetchSubsCount(subBar);
				fetchLatestFollower();
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
        followerCurr = channel.followers;
        console.log('follower_current ' + followerCurr);

        $('#follower-current').text(followerCurr);
		var followerGoal = $('#follower-goal').text();
		var fQuota = followerCurr/followerGoal;
		followerBar.animate(fQuota);
    });
}

function fetchSubsCount(subsBar) {
	var subsCurr = 0;
    Twitch.api({method: 'channels/neobaldhornrich/subscriptions'}, function(error, subscriptions) {
    	// Fetch subscriptions count
        subsCurr = subscriptions._total - 1;
        console.log('subs_current ' + subsCurr);

        // Print out sub count and update progress bar
        $('#subs-current').text(subsCurr);
		var subsGoal = $('#subs-goal').text();
		var sQuota = subsCurr/subsGoal;
		subsBar.animate(sQuota);

        // Fetch latest sub user
        var latestSub = subscriptions.subscriptions.slice(-1).pop().user.display_name;
        console.log('sub_latest ' + latestSub);

		// Print out latest sub
        $('#latest-sub-current').text(latestSub);
    });
}

function fetchLatestFollower() {
    Twitch.api({method: 'channels/neobaldhornrich/follows'}, function(error, follows) {
        // console.log(follows);

        latestFollower = follows.follows[0].user.display_name;
        console.log('follower_latest ' + latestFollower);

        $('#latest-follower-current').text(latestFollower);
    });
}