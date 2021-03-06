angular.module('authservice', [])

	// ===================================================
	// auth factory to login and get information
	// inject $http for communicating with the API
	// inject $q to return promise objects
	// inject userAuthToken to manage tokens
	// ===================================================
	.factory('Auth', function ($http, $q, userAuthToken, $window) {

		// create auth factory object
		var authFactory = {};

		// log a user in
		authFactory.login = function (user) {

			// return the promise object and its data
			return $http.post('/api/login', user)
				.success(function (data) {
					console.log(data);
					if (data.token) {
						userAuthToken.setToken(data.token);
					}
					return data;
				});
		};

		authFactory.signup = function (user) {
			return $http.post('/api/signup', user);
		}

		// log a user out by clearing the token
		authFactory.logout = function () {
			// clear the token
			userAuthToken.setToken();
		};
		var payload;
		// check if a user is logged in
		// checks if there is a local token
		authFactory.isLoggedIn = function () {
			var token = userAuthToken.getToken();
			if (token) {
				payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);
				return payload.exp > Date.now() / 1000;
			}
			else {
				return false;
			}
		};

		// get the logged in user
		authFactory.getUser = function () {
			if (userAuthToken.getToken())
				return payload;
			else
				return false;
		};

		authFactory.check = function (name) {
			return $http.post('/api/check', name)
				.success(function (data) {
					return data.data;
				})
				.error(function (data) {
					alert('Some Error Occured!');
					return data.data;
				});
		};

		// return auth factory object
		return authFactory;

	})

	// ===================================================
	// factory for handling tokens
	// inject $window to store token client-side
	// ===================================================
	.factory('userAuthToken', function ($window) {

		var authTokenFactory = {};

		// get the token out of local storage
		authTokenFactory.getToken = function () {
			return $window.localStorage.getItem('codeburn-token');
		};

		// function to set token or clear token
		// if a token is passed, set the token
		// if there is no token, clear it from local storage
		authTokenFactory.setToken = function (token) {
			if (token)
				$window.localStorage.setItem('codeburn-token', token);
			else
				$window.localStorage.removeItem('codeburn-token');
		};

		return authTokenFactory;

	})
	.factory('challengeFactory', function ($http, Auth, $location, userAuthToken) {
		var userChallengeFactory = {};
		
		userChallengeFactory.get = function () {
			var token;
			if (Auth.isLoggedIn()) {
				token = userAuthToken.getToken();
			}
			else {
				token = null;
				alert('Not a valid user session!');
				return false;
			}
			return $http.get('/api/challenges', {
				headers: {
					'x-access-token': token
				}
			}).then(function (data) {
				return data.data;
			});
		}
		return userChallengeFactory;
	});