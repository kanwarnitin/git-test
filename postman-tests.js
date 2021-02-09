// Following fields must never be null/missing in Response
function findAllByKey(obj, keyToFind) {
    return Object.entries(obj)
      .reduce((acc, [key, value]) => (key === keyToFind)
        ? acc.concat(value)
        : (typeof value === 'object')
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc
      , [])
  }

pm.test("Response body contains search_result", function () {
    var json = pm.response.json();
    pm.expect(json.search_result)
});

pm.test("Mandatory fields have values in response body", function () {

    var json = JSON.parse(responseBody);
    const { k2_identifier, search_status, cpn } = json.search_result[0];
    pm.expect(k2_identifier).is.not.null && pm.expect(k2_identifier).is.not.oneOf(["null", "Null", "NULL"]);
    pm.expect(search_status).is.not.null && pm.expect(search_status).is.not.oneOf(["null", "Null", "NULL"]);
    pm.expect(cpn).is.not.null && pm.expect(cpn).is.not.oneOf(["null", "Null", "NULL"]);

});

//Assestions when search status is SUCCESS
pm.test("JSON is valid", function () {

    var jsonData = pm.response.json();

    _.each(jsonData.search_result, (item) => {
        var hasNullKey = Object.keys(item).find(key => item[key] === "null");
        pm.expect(hasNullKey).is.undefined;

        var hasNilProperty = findAllByKey(item, "@nil")
        pm.expect(hasNilProperty).is.eql([]);

        pm.expect(item.search_status).is.eql("SUCCESS") || pm.expect(item.search_status).is.eql("FAIL")

        pm.expect(item.k2_identifier).is.not.null && pm.expect(item.k2_identifier).is.not.oneOf(["null", "Null", "NULL"]);
        pm.expect(item.cpn).is.not.null && pm.expect(item.cpn).is.not.oneOf(["null", "Null", "NULL"]);

        if (item.search_status === "SUCCESS") {
            pm.expect(item.bsa_header_id).is.not.null;
            pm.expect(item.bsa_line_id).is.not.null;
            pm.expect(item.ou_id).is.not.null;
            pm.expect(item.bsa_number).is.not.null;
            pm.expect(item.bsa_status).is.not.null;
            pm.expect(item.bsa_line_number).is.not.null;
            pm.expect(item.bsa_activation_date).is.not.null || pm.expect(item.bsa_line_start_date).is.not.null ;
            pm.expect(item.bsa_expiration_date).is.not.null || pm.expect(item.bsa_line_end_date).is.not.null ;
            pm.expect(item.apn).is.not.null;
            pm.expect(item.ship_from_wh_code).is.not.null;
            pm.expect(item.remaining_qty).is.not.null;
            pm.expect(item.min_qty_agreed).is.not.null;
            pm.expect(item.max_qty_agreed).is.not.null;
            pm.expect(item.inventory_item_id).is.not.null;
            pm.expect(String(item.k2_identifier)).to.deep.eql(pm.request.url.toJSON().query.find(m => m.key === "k2_identifier").value);
            pm.expect(String(item.cpn)).to.deep.eql(pm.request.url.toJSON().query.find(m => m.key === "cpn").value);
        }

        //if (item.search_status === "FAIL") {
        //}

        
    })

});

