const DATA_TYPES = {
    "result_old": "2018-as eredmény (fő)",
    "result_old_pp": "2018-as eredmény (%)",
    "result_new": "2022-es eredmény (fő)",
    "result_new_pp": "2022-es eredmény (%)",
    "vote_gain": "szavazóbázis különbség",
    "pp_increase": "százalékpontos különbség"
  }

  const COLOR_SCHEMES = {
    "redgreen": "piros->narancs / sárga->zöld",
    "blackwhite": "fekete-szürke / szürke->fehér",
    "redblue": "piros->sárga / zöld->kék",
    "yellowblue": "sárga->piros / lila->kék"
  }

  const PARTIES_OLD = [
    "FIDESZ",
    "MKKP",
    "LMP", "MSZP", "MOMENTUM", "DK", "EGYUTT",
    "JOBBIK"
  ]

  const PARTIES_NEW = [
    "FIDESZ",
    "MKKP",
    "ÖSSZEFOGÁS",
    "MI HAZÁNK"
  ]

  var dataType = "result_new_pp";
  var scaling = false;
  var countyMode = false;

  var max = -Infinity;
  var min = Infinity;
  var scale = 0;
  var colorScheme = "redgreen"

  var fromDataPlus = ["FIDESZ"];
  var toDataPlus = ["FIDESZ"];

  var fromDataMinus = ["LMP", "MSZP", "MOMENTUM", "JOBBIK", "DK", "EGYUTT"];
  var toDataMinus = ["ÖSSZEFOGÁS", "MI HAZÁNK"];

  var tiles = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
    }),
    latlng = L.latLng(47.19801, 19.3);

  var hun = L.map('hun', { center: latlng, zoom: 7, layers: [tiles] });
  var hunLayer;

  function getValue(county, evkSelect) {
    var fromTotal = 0;
    var toTotal = 0;
    var fromValue = 0;
    var toValue = 0;
    var fromValueMinus = 0;
    var toValueMinus = 0;

    for (var evk in LISTA_2018[county]) {
      if (evk == evkSelect || !evkSelect || evkSelect == "0") {
        fromTotal += LISTA_2018[county][evk]['ervenyes'];
        toTotal += LISTA_2022[county][evk]['ervenyes'];

        for (var fromParty of fromDataPlus) {
          fromValue += LISTA_2018[county][evk][fromParty];
        }

        for (var toParty of toDataPlus) {
          toValue += LISTA_2022[county][evk][toParty];
        }

        for (var fromParty of fromDataMinus) {
          fromValueMinus += LISTA_2018[county][evk][fromParty];
        }

        for (var toParty of toDataMinus) {
          toValueMinus += LISTA_2022[county][evk][toParty];
        }
      }
    }

    if (scaling) {
      toValue = toValue / toTotal * fromTotal;
      toValueMinus = toValueMinus / toTotal * fromTotal;
      toTotal = fromTotal;
    }

    var returnValue1 = 0;
    var returnValue2 = 0;

    switch (dataType) {
      case "result_old":
        returnValue1 = fromValue;
        returnValue2 = fromValueMinus;
        break;
      case "result_old_pp":
        returnValue1 = (fromValue / fromTotal) * 100;
        returnValue2 = (fromValueMinus / fromTotal) * 100;
        break;
      case "result_new":
        returnValue1 = toValue;
        returnValue2 = toValueMinus;
        break;
      case "result_new_pp":
        returnValue1 = (toValue / toTotal) * 100;
        returnValue2 = (toValueMinus / toTotal) * 100;
        break;
      case "vote_gain":
        returnValue1 = toValue - fromValue;
        returnValue2 = toValueMinus - fromValueMinus;
        break;
      case "pp_increase":
        returnValue1 = ((fromValue == 0) ? 0 : toValue / fromValue) * 100;
        returnValue2 = ((toValueMinus == 0) ? 0 : fromValueMinus / toValueMinus) * 100;
        break;
    }

    return [ returnValue1 - returnValue2, {
      all: {
        old: fromTotal,
        new: toTotal,
      },
      party_1: {
        old: fromValue,
        new: toValue,
        old_pp: fromValue / fromTotal,
        new_pp: toValue / toTotal,
        gain: toValue / fromValue,
        loss: fromValue / toValue,
        win: toValue - fromValue
      },
      party_2: {
        old: fromValueMinus,
        new: toValueMinus,
        old_pp: fromValueMinus / fromTotal,
        new_pp: toValueMinus / toTotal,
        gain: toValueMinus / fromValueMinus,
        loss: fromValueMinus / toValueMinus,
        win: toValueMinus - fromValueMinus
      }
    }]
  }

  function recalcMinMax() {
    max = -Infinity;
    min = Infinity;

    for (var county in LISTA_2018) {
      for (var evk in (countyMode) ? [0] : LISTA_2018[county]) {
        var [difference, ] = getValue(county, evk);

        if (difference > max) {
          max = difference;
        }
        if (difference < min) {
          min = difference;
        }
      }
    }

    if (min==0) { min = -1 }
    if (max==0) { max = 1 }

    var scaleMin = -max-1;
    var scaleMax = -min+1;
    document.getElementById("comparison_scale_min").value = min;
    document.getElementById("comparison_scale_max").value = max;

    // if (scale < scaleMin) {
    //   scale = 0;
    // }
    // if (scale > scaleMax) {
    //   scale = 0;
    // }

    document.getElementById("comparison_scale_range").max = Math.floor(scaleMax);
    document.getElementById("comparison_scale_range").min = Math.ceil(scaleMin);
    document.getElementById("comparison_scale_range").value = scale;

    document.getElementById("comparison_scale_text").max = Math.floor(scaleMax);
    document.getElementById("comparison_scale_text").min = Math.ceil(scaleMin);
    document.getElementById("comparison_scale_text").value = scale;
  }

  function handler(type) {
    return function(feature, layer) {
      var county = feature.properties.MEGY_KOD;
      var evk = feature.properties.OEVK_STR;

      var [difference, log] = getValue(county, evk);

      if (type == 'color') {
        var value = difference + scale;
        var minScale = min + scale;
        var maxScale = max + scale;
        if (minScale > 0) {
          percentage = (value - minScale) / (maxScale-minScale) / 3 + 0.66;
        } else if (maxScale < 0) {
          percentage = 0.34 - (value - maxScale) / (minScale-maxScale) / 3;
        } else {
          if (value > 0) {
            percentage = value / maxScale / 3 + 0.66;
          } else {
            percentage = 0.34 - value / minScale / 3;
          }
        }

        if (percentage < 0) percentage = 0;
        if (percentage > 1) percentage = 1;

        switch(colorScheme) {
        case "redgreen":
          var value = Math.round(percentage * 120);
          var color = 'hsl(' + value + ',100%,50%)';
          return { color: '#AAA', fillColor: color, opacity: 1, fillOpacity: 0.5, weight: 1 };
        case "blackwhite":
          var value = Math.round(percentage * 100);
          var color = 'hsl(0,0%,'+ value+ '%)';
          return { color: '#AAA', fillColor: color, opacity: 1, fillOpacity: 0.75, weight: 1 };
        case "redblue":
          var value = Math.round(percentage * 220);
          var color = 'hsl(' + value + ',100%,50%)';
          return { color: '#AAA', fillColor: color, opacity: 1, fillOpacity: 0.5, weight: 1 };
        case "yellowblue":
          var value = 60 - Math.round(percentage * 180);
          var color = 'hsl(' + value + ',100%,50%)';
          return { color: '#AAA', fillColor: color, opacity: 1, fillOpacity: 0.5, weight: 1 };
        }
        return {};
      } else if (type == 'click') {
        var result = "";
        switch (dataType) {
          case "result_old":
            result = 'Különbség: <b>' + difference + ' fő</b>';
            break;
          case "result_new":
            result = 'Különbség: <b>' + difference + ' fő</b>';
            break;
          case "result_old_pp":
            result = 'Különbség: <b>' + difference.toFixed(3) + 'pp</b>';
            break;
          case "result_new_pp":
            result = 'Különbség: <b>' + difference.toFixed(3) + 'pp</b>';
            break;
          case "vote_gain":
            result = 'Különbség: <b>' + difference + ' fő</b>';
            break;
          case "pp_increase":
            result = 'Különbség: <b>' + difference.toFixed(3) + 'pp</b>';
            break;
        }

        if ((toDataMinus.length == 0 || fromDataMinus.length == 0) && dataType != "vote_gain") {
          result = result.replace("Különbség", "Eredmény").replace('pp','%');
        };

        var evkText = '';

        if (evk) {
          evkText = ' (' + evk + ')';
        }

        var debuginfo = '';

        if (scaling) {
          debuginfo += "<br><b>Figyelem!</b> A 2022-es számadatok arányosítva vannak!<br><br>";
        }

        if (log.all.old) debuginfo += "2018-ban érvényesen szavaztak: <b>" + log.all.old + " fő</b><br/>";
        if (log.all.new) debuginfo += "2022-ben érvényesen szavaztak: <b>" + log.all.new + " fő</b>" + (scaling?" Arányosítva":"") + "<br/>";

        if (log.party_1.old || log.party_1.new) {
          debuginfo += "<br>";
          if (log.party_1.old) debuginfo += "<b>2018:</b> " + fromDataPlus.join(", ") + '<br/>';
          if (log.party_1.new) debuginfo += "<b>2022:</b> " + toDataPlus.join(", ") + '<br/>';

          if (log.party_1.old) debuginfo += "2018-as szavazatszám: <b>" + log.party_1.old + " fő</b> (<b>" + (log.party_1.old_pp*100).toFixed(3) + "%</b>)<br />";
          if (log.party_1.new) debuginfo += "2022-es szavazatszám: <b>" + log.party_1.new.toFixed(0) + " fő</b> (<b>" + (log.party_1.new_pp*100).toFixed(3) + "</b>%)<br/>";

          if (log.party_1.old && log.party_1.new) {
            debuginfo += "2018-2022 különbség: <b>" + (log.party_1.gain*100-100).toFixed(3) + "%</b><br />";
            debuginfo += "2022-2018 különbség: <b>" + (log.party_1.loss*100-100).toFixed(3) + "%</b><br />";
            debuginfo += "Szavazóbázis változása: <b>" + log.party_1.win.toFixed(0) + " fő</b><br />";;
          }
        }

        if (log.party_2.old || log.party_2.new) {
          debuginfo += "<br>";
          if (log.party_2.old) debuginfo += "<b>2018:</b> " + fromDataMinus.join(", ") + '<br/>';
          if (log.party_2.new) debuginfo += "<b>2022:</b> " + toDataMinus.join(", ") + '<br/>';

          if (log.party_2.old) debuginfo += "2018-as szavazatszám: <b>" + log.party_2.old + " fő</b> (<b>" + (log.party_2.old_pp*100).toFixed(3) + "%</b>)<br />";
          if (log.party_2.old) debuginfo += "2022-es szavazatszám: <b>" + log.party_2.new.toFixed(0) + " fő</b> (<b>" + (log.party_2.new_pp*100).toFixed(3) + "%</b>)<br/>";

          if (log.party_2.old && log.party_2.new) {
            debuginfo += "2018-2022 különbség: <b>" + (log.party_2.gain*100-100).toFixed(3) + "%</b><br />";
            debuginfo += "2022-2018 különbség: <b>" + (log.party_2.loss*100-100).toFixed(3) + "%</b><br />";

            debuginfo += "Szavazóbázis változása: <b>" + log.party_2.win.toFixed(0) + " fő</b><br />";
          }
        }

        layer.bindPopup('<b>' + feature.properties.MEGY_NEV + evkText +
                    '</b><br/>' + result + '<br/><br/>' + debuginfo);
        layer.bindTooltip('<b>' + feature.properties.MEGY_NEV + evkText +
                    '</b><br/>' + result);
      }
    }
  }

  function loadKor(event) {
    var inputs = document.querySelectorAll('#settings_form input');
    fromDataPlus = [];
    toDataPlus = [];
    fromDataMinus = [];
    toDataMinus = [];

    for (var i = 0; i< inputs.length; i++) {
      if (!inputs[i].checked) {
        continue;
      }
      element = null;
      switch (inputs[i].className) {
        case "party_fromDataPlus": element = fromDataPlus; break;
        case "party_toDataPlus": element = toDataPlus; break;
        case "party_fromDataMinus": element = fromDataMinus; break;
        case "party_toDataMinus": element = toDataMinus; break;
      }
      if (element) {
        element.push(inputs[i].value);
      }

      for (var type in DATA_TYPES) {
        if (inputs[i].className == "type_" + type) {
          dataType = type;
        }
      }

      for (var type in COLOR_SCHEMES) {
        if (inputs[i].className == "color_" + type) {
          colorScheme = type;
        }
      }
    }

    if (event) {
      if (event.target.id == "comparison_scale_range") {
        scale = parseFloat(document.getElementById("comparison_scale_range").value);
        document.getElementById("comparison_scale_text").value = scale;
      }
      if (event.target.id == "comparison_scale_text") {
        scale = parseFloat(document.getElementById("comparison_scale_text").value);
        document.getElementById("comparison_scale_range").value = scale;
      }
      if (event.target.id == "comparison_use_scaling") {
        scaling = document.getElementById("comparison_use_scaling").checked;
      }
      if (event.target.id == "comparison_scale_reset") {
        scale = 0;
        document.getElementById("comparison_scale_range").value = scale;
        document.getElementById("comparison_scale_text").value = scale;
      }
      if (event.target.id == "county_view_button") {
        countyMode = document.getElementById("county_view_button").checked;
      }
    }

    recalcMinMax();

    if (hunLayer) {
      hun.removeLayer(hunLayer);
    }
    hunLayer = L.geoJSON(countyMode ? MEGYE : SZAVAZOKOR, { style: handler('color'), onEachFeature: handler('click') });
    hunLayer.addTo(hun);
  }

  function setupSettings() {
    document.getElementById("settings_button").onclick = function() {
      var settings = document.getElementById("settings_content");
      if (settings.style.display != "block") {
        settings.style.display = "block";
        document.getElementById("settings_button").textContent = "[X]";
      } else {
        settings.style.display = "none";
        document.getElementById("settings_button").textContent = "🔧";
      }
    };

    var old1 = document.getElementById("old_party1");
    var old2 = document.getElementById("old_party2");
    var boxes = {
      fromDataPlus: old1,
      fromDataMinus: old2,
    }
    for (var party of PARTIES_OLD) {
      for (var box in boxes) {
        boxes[box].insertAdjacentHTML('beforeend', '<input class="party_' + box + '" type="checkbox" value="'+ party + '"  '+(box.indexOf('Minus') == -1 && party == 'FIDESZ' ? 'checked' : '')+'> ' + party + '<br/>');
      }
    }

    old1 = document.getElementById("new_party1");
    old2 = document.getElementById("new_party2");
    boxes = {
      toDataPlus: old1,
      toDataMinus: old2,
    }
    for (var party of PARTIES_NEW) {
      for (var box in boxes) {
        boxes[box].insertAdjacentHTML('beforeend', '<input class="party_' + box + '" type="checkbox" value="'+ party + '"  '+(box.indexOf('Minus') == -1 && party == 'FIDESZ' ? 'checked' : '')+'> ' + party + '<br/>');
      }
    }

    var typeBox = document.getElementById("comparison_type");
    for (var type in DATA_TYPES) {
      typeBox.insertAdjacentHTML('beforeend', '<input name="data_type" class="type_' + type +'" type="radio" value="' + type + '" '+(type == dataType ? 'checked' : '')+'>' + DATA_TYPES[type] + '<br/>');
    }

    var colorBox = document.getElementById("county_view");
    for (var type in COLOR_SCHEMES) {
      colorBox.insertAdjacentHTML('beforeend', '<input name="color_scheme" class="color_' + type +'" type="radio" value="' + type + '" '+(type == colorScheme ? 'checked' : '')+'>' + COLOR_SCHEMES[type] + '<br/>');
    }

    var inputs = document.querySelectorAll('#settings_form input');
    for (var i = 0; i< inputs.length; i++) {
      inputs[i].addEventListener("change", loadKor, false);
    }

    document.getElementById("comparison_scale_reset").addEventListener("click", loadKor, false);
  }

  setupSettings();
  loadKor();
