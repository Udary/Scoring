angular.module('scoringApp', ['ngStorage'])
    .controller('ScoringController', function($scope, $localStorage) {
        var scoring = this;

        $scope.iTotal = 0;
        $scope.sTotal = 0;

        scoring.rounds = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];


        scoring.init = function() {
            if (!$localStorage.iScores || !$localStorage.sScores || !$localStorage.round)
                scoring.clearScores();

            getTotals();
        }

        scoring.clearScores = function() {
            $localStorage.round = 0;
            $localStorage.iScores = [];
            $localStorage.sScores = [];
            $localStorage.winner = "";
            getTotals();
        }

        scoring.doWeHaveAWinner = function() {
            return $localStorage.winner;
        }

        scoring.getRound = function() {
            return $localStorage.round;
        }

        scoring.getRoundChar = function() {
            return scoring.rounds[$localStorage.round];
        }

        scoring.getScore = function() {
            $scope.showGetScore = !$scope.showGetScore;
        }

        scoring.saveScore = function() {
            $localStorage.iScores[$localStorage.round] = ($scope.iScore) ? parseInt($scope.iScore) : 0;
            $localStorage.sScores[$localStorage.round] = ($scope.sScore) ? parseInt($scope.sScore) : 0;

            $('#scoreModal').modal('hide');

            $localStorage.round++;

            $scope.sScore = "";
            $scope.iScore = "";

            getTotals();

            if ($localStorage.round == 13)
                scoring.declareWinner();
        }

        scoring.removeScore = function(index) {
            $localStorage.iScores[index] = "";
            $localStorage.sScores[index] = "";
            $localStorage.round = index--;
            getTotals();
        }

        scoring.declareWinner = function() {
            $localStorage.winner = $scope.iTotal < $scope.sTotal ? "I" : "S";
        }

        scoring.showMinus = function(index) {
            return $localStorage.round <= index + 1;
        }

        scoring.getScore = function(key, index) {
            var val = "-";
            if (key == 'i')
                val = $localStorage.iScores[index];
            else
                val = $localStorage.sScores[index]

            return val == 0 ? "-" : val;
        }

        scoring.getITotal = function() {
            var total = 0;
            if ($localStorage.iScores) {
                $localStorage.iScores.forEach(score => {
                    if (score)
                        total += parseInt(score);
                });
            }
            $scope.iTotal = total;
        }

        scoring.getSTotal = function() {
            var total = 0;
            if ($localStorage.sScores) {
                $localStorage.sScores.forEach(score => {
                    if (score)
                        total += parseInt(score);
                });
            }
            $scope.sTotal = total;
        }

        getTotals = function() {
            scoring.getITotal();
            scoring.getSTotal();
        }

        scoring.init();

    });