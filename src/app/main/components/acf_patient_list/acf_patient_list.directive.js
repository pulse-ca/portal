(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiAcfPatientList', aiAcfPatientList);

    /** @ngInject */
    function aiAcfPatientList() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/main/components/acf_patient_list/acf_patient_list.html',
            scope: { registerHandler: '&' },
            controller: AcfPatientListController,
            controllerAs: 'vm',
            bindToController: {
                activeDocument: '=?'
            },
            link: function (scope, element, attr, ctrl) {
                var handler = scope.registerHandler({
                    handler: function () {
                        ctrl.getPatientsAtAcf();
                    }
                });
                scope.$on('$destroy', handler);
            }

        };

        return directive;

        /** @ngInject */
        function AcfPatientListController($log, commonService) {
            var vm = this;

            vm.cacheDocument = cacheDocument;
            vm.dischargePatient = dischargePatient;
            vm.getDocument = getDocument;
            vm.getPatientsAtAcf = getPatientsAtAcf;
            vm.getUserAcf = getUserAcf;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.patients = [];
                vm.getPatientsAtAcf();
            }

            function cacheDocument (patient, doc) {
                commonService.cacheDocument(patient.id, doc.id).then(function () {
                    doc.cached = true;
                });
            }

            function dischargePatient (index) {
                if (index < vm.patients.length) {
                    vm.patients.splice(index,1);
                }
            }

            function getDocument (patient, doc) {
                if (!doc.data) {
                    commonService.getDocument(patient.id, doc.id).then(function (response) {
                        doc.data = response.data;
                        vm.activeDocument = doc;
                    });
                } else {
                    vm.activeDocument = doc;
                }
            }

            function getPatientsAtAcf () {
                commonService.getPatientsAtAcf().then(function (response) {
                    vm.patients = response;
                });
            }

            function getUserAcf () {
                return commonService.getUserAcf();
            }
        }
    }
})();
