/*
 * HouseholdDisplay
 *
 * Copyright (c) 2018 CoNWeT
 * Licensed under the MIT license.
 */

/* exported HouseholdDisplay */
/* globals StyledElements */

var HouseholdDisplay = (function () {


    "use strict";
    var parseInputEndpointData = function parseInputEndpointData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }
        }

        if (data == null || typeof data !== "object") {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }

        return data;
    };

    var HouseholdDisplay = function HouseholdDisplay() {
        MashupPlatform.prefs.registerCallback(function (new_preferences) {

        }.bind(this));

        MashupPlatform.wiring.registerCallback('inputEntity', function (e) {
            var entity = parseInputEndpointData(e);
            // Send the PoI through the output endpoint
            var coordinates = {
                system: "WGS84",
                lng: parseFloat(entity.Longitude),
                lat: parseFloat(entity.Latitude)
            };
            var poi = {
                id: entity.id,
                tooltip: entity.id,
                data: entity,
                title: "Household",
                currentLocation: coordinates
            };
            MashupPlatform.wiring.pushEvent("outputPOI", poi);

            // Display the entity on the widget
            displayEntity(entity);
        });
    };

    var keyvalues = [
        {
            name: "Latitude",
            desc: "Latitude: "
        },
        {
            name: "Longitude",
            desc: "Longitude: "
        },
        {
            name: "Gender",
            desc: "Gender: "
        },
        {
            name: "NoofMaleMember",
            desc: "No. of male members in family: "
        },
        {
            name: "NoofFemaleMember",
            desc: "No. of female members in family: "
        },
        {
            name: "SocialCatagory",
            desc: "Social category: "
        },
        {
            name: "EconomicCatagory",
            desc: "Economic category: "
        },
        {
            name: "IsToilet",
            desc: "Do you have or use a toilet: "
        },
        {
            name: "DifferentAbled",
            desc: "Different abled (PH) in family: "
        }
    ];
    var displayEntity = function displayEntity(entity) {
        var elements = document.getElementById('elements');
        elements.innerHTML = ""; // Empty it for the new entity
        keyvalues.forEach(function (kv) {
            var e = new StyledElements.Fragment("<p><b>" + kv.desc + "</b>" + entity[kv.name] + "</p>");
            e.insertInto(elements);
        });
    };

    var harvestOpenStackToken = function harvestOpenStackToken(server, username, password, projectID, file) {
        "http://cloud.lab.fiware.org:4730/v3/auth/tokens"

        MashupPlatform.http.makeRequest(server + "/v3/auth/tokens", {
            method: 'GET',
            supportsAccessControl: false,
            parameters: {
                auth: {
                    identity: {
                        methods: [
                            "password"
                        ],
                        password: {
                            user: {
                                name: username,
                                password: password,
                                domain: {
                                    name: "default"
                                }
                            }
                        }
                    },
                    scope: {
                        project: {
                            id: projectID
                        }
                    }
                }
            },
            requestHeaders: {},
            onSuccess: function (response) {
                var token = response.getHeader("X-Subject-Token");
                harvestOpenStackFile(server, token, projectID, file);
            }
        });
    };

    var harvestOpenStackFile = function harvestOpenStackFile(server, token, projectID, file) {
        var requestHeaders = {};
        requestHeaders["X-Auth-Token"] = token;
        MashupPlatform.http.makeRequest(server + "/v1/AUTH_" + projectID + "/" + file, {
            method: 'GET',
            supportsAccessControl: false,
            parameters: {},
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                // Use the file and insert it into image element
                // document.getElementById('image');
            }
        });
    };

    return HouseholdDisplay;

})();
