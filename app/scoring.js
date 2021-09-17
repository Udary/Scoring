angular.module('scoringApp', ['ngRoute', 'ngStorage'])
    .config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/score', {
                    templateUrl: 'views/score.html',
                    controller: 'ScoringController',
                    controllerAs: 'scoring'
                })
                .when('/history', {
                    templateUrl: 'views/history.html',
                    controller: 'ScoringController',
                    controllerAs: 'scoring'
                });

            $locationProvider.html5Mode(true);
        }])
    .controller('ScoringController', function ($location, $route, $scope, $localStorage) {
        var scoring = this;

        $scope.iTotal = 0;
        $scope.sTotal = 0;
        $scope.Math = window.Math;
        $scope.roundCount = 13;

        scoring.version = "1.1";
        scoring.rounds = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

        scoring.init = function () {
            if (!$localStorage.iScores || !$localStorage.sScores || !$localStorage.round)
                scoring.clearScores();

            if (!$location.path()) {
                $location.path("/score")
            }

            if (window.location.host == 'localhost')
                $scope.roundCount = 3;

            getTotals();
        }

        scoring.doWeHaveAWinner = function () {
            return $localStorage.winner;
        }

        scoring.getRound = function () {
            return $localStorage.round;
        }

        scoring.getHistory = function () {
            return $localStorage.history;
        }

        scoring.getRoundChar = function () {
            return scoring.rounds[$localStorage.round];
        }

        scoring.getScore = function () {
            $scope.showGetScore = !$scope.showGetScore;
        }

        scoring.clearScores = function () {
            $localStorage.round = 0;
            $localStorage.iScores = [];
            $localStorage.sScores = [];
            $localStorage.winner = "";
            getTotals();
        }

        scoring.saveScore = function () {
            $localStorage.iScores[$localStorage.round] = ($scope.iScore) ? parseInt($scope.iScore) : 0;
            $localStorage.sScores[$localStorage.round] = ($scope.sScore) ? parseInt($scope.sScore) : 0;

            $('#scoreModal').modal('hide');

            $localStorage.round++;

            $scope.sScore = "";
            $scope.iScore = "";

            getTotals();

            if ($localStorage.round >= $scope.roundCount) { // should be 13
                scoring.saveHistory();
                scoring.declareWinner();
            }
        }

        scoring.removeScore = function (index) {
            $localStorage.iScores[index] = "";
            $localStorage.sScores[index] = "";
            $localStorage.round = index--;
            getTotals();
        }

        scoring.saveHistory = function () {
            var newScore = {
                date: Date.now(),
                iScores: $localStorage.iScores,
                sScores: $localStorage.sScores
            };
            if (!$localStorage.history) $localStorage.history = [];
            $localStorage.history.push(newScore);
        }

        scoring.removeHistory = function (index) {
            $localStorage.history.splice(index, 1);
        }

        scoring.declareWinner = function () {
            $localStorage.winner = $scope.iTotal < $scope.sTotal ? "I" : "S";
        }

        scoring.showMinus = function (index) {
            return $localStorage.round <= index + 1;
        }

        scoring.getScore = function (key, index) {
            var val = "-";
            if (key == 'i')
                val = $localStorage.iScores[index];
            else
                val = $localStorage.sScores[index]

            return val == 0 ? "-" : val;
        }

        scoring.getITotal = function () {
            var total = 0;
            if ($localStorage.iScores) {
                $localStorage.iScores.forEach(score => {
                    if (score)
                        total += parseInt(score);
                });
            }
            $scope.iTotal = total;
        }

        scoring.getSTotal = function () {
            var total = 0;
            if ($localStorage.sScores) {
                $localStorage.sScores.forEach(score => {
                    if (score)
                        total += parseInt(score);
                });
            }
            $scope.sTotal = total;
        }

        scoring.whoWon = function (obj) {
            var iScore = 0;
            var sScore = 0;
            obj.iScores.forEach(score => {
                if (score)
                    iScore += parseInt(score);
            });
            obj.sScores.forEach(score => {
                if (score)
                    sScore += parseInt(score);
            });

            return (iScore < sScore) ? "I" : "S";
        }

        scoring.getIRoundTotal = function (round) {
            if (!round) return;
            processRound(round);
            return round.iTotal;
        }

        scoring.getSRoundTotal = function (round) {
            if (!round) return;
            processRound(round);
            return round.sTotal;
        }

        scoring.getIWins = function (round) {
            if (!round) return;
            processRound(round);
            return round.iWins;
        }

        scoring.getSWins = function (round) {
            if (!round) return;
            processRound(round);
            return round.sWins;
        }

        scoring.toDate = function (date) {
            formattedDate = new Date(date);

            let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            let day = formattedDate.getDate();
            let monthIndex = formattedDate.getMonth();
            let monthName = monthNames[monthIndex];
            let year = formattedDate.getFullYear();

            return `${day} ${monthName} ${year}`;
        }

        processRound = function (round) {
            if (!round) return;
            if (round.iScores) {
                var iWins = 0;
                var iScore = 0;
                var iRound = 0;
                round.iScores.forEach(score => {
                    iScore += parseInt(score);
                    if (parseInt(score) === 0) iWins++;
                    iRound++;
                });
                round.iWins = iWins;
                round.iTotal = iScore;
                round.iRound = iRound;
            }
            if (round.iScores) {
                var sWins = 0;
                var sScore = 0;
                var sRound = 0;
                round.sScores.forEach(score => {
                    sScore += parseInt(score);
                    if (parseInt(score) === 0) sWins++;
                    sRound++;
                });
                round.sWins = sWins;
                round.sTotal = sScore;
                round.sRound = sRound;
            }
        }

        getTotals = function () {
            scoring.getITotal();
            scoring.getSTotal();
        }

        scoring.init();

    });