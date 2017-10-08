const Lang = imports.lang;
const Soup = imports.gi.Soup;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const XML = Me.imports.xml.parser;

const MantisUa = new Lang.Class({
    Name: 'MantisUa',

    _init: function (baseUrl, credentials) {
        this.baseUrl = baseUrl;
        this.username = credentials && credentials.username;
        this.password = credentials && credentials.password;
        this.httpSession = new Soup.Session();
    },

    request: function (query, body, responseCallback) {

        let url = this.baseUrl + query;
        let message = Soup.Message.new('POST', url);

        if (this.username && this.password) {
            message.request_headers.append("Authorization", authorization(this.username, this.password));
        }

        message.set_request('text/xml; charset=utf-8', Soup.MemoryUse.COPY, body)

        this.httpSession.queue_message(message, Lang.bind(this, handleResponse));

        function handleResponse(_httpSession, message) {
            if (message.status_code !== 200) {
                throw new Error('Query failed with `' + message.status_code + '` error code.');
            }
            return responseCallback(message.response_body.data, message.status_code);
        }

        function authorization(username, password) {
            let basicAuth = username + ':' + password;
            return GLib.base64_encode(basicAuth);
        }
    }

});

const Tickets = new Lang.Class({
    Name: 'Tickets',
    
    _init: function (mantisUa) {
        this.mantisUa;
    },

    list: function (sprint, handler /* a.k.a 'assigned to' */, listCallback) {

        const request = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://futureware.biz/mantisconnect" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
        '  <SOAP-ENV:Body>' +
        '    <ns1:mc_filter_search_issues>' +
        '      <username xsi:type="xsd:string">administrator</username>' +
        '      <password xsi:type="xsd:string">qlTxPh9jA6pMX9MFA-LZBlH6YA-Owy6t</password>' +
        '      <filter xsi:type="ns1:FilterSearchData">' +
        '        <custom_fields SOAP-ENC:arrayType="ns1:FilterCustomField[2]" xsi:type="ns1:FilterCustomFieldArray">' +
        '          <item xsi:type="ns1:FilterCustomField">' +
        '            <field xsi:type="ns1:ObjectRef">' +
        '              <name xsi:type="xsd:string">Sprint</name>' +
        '            </field>' +
        '            <value SOAP-ENC:arrayType="xsd:string[1]" xsi:type="ns1:StringArray">' +
        '              <item xsi:type="xsd:string">' + sprint + '</item>' +
        '            </value>' +
        '          </item>' +
        '          <item xsi:type="ns1:FilterCustomField">' +
        '            <field xsi:type="ns1:ObjectRef">' +
        '              <name xsi:type="xsd:string">Team</name>' +
        '            </field>' +
        '            <value SOAP-ENC:arrayType="xsd:string[1]" xsi:type="ns1:StringArray">' +
        '              <item xsi:type="xsd:string">Dev</item>' +
        '            </value>' +
        '          </item>' +
        '        </custom_fields>' +
        '      </filter>' +
        '      <page_number xsi:type="xsd:integer">0</page_number>' +
        '      <per_page xsi:type="xsd:integer">-1</per_page>' +
        '    </ns1:mc_filter_search_issues>' +
        '  </SOAP-ENV:Body>' +
        '</SOAP-ENV:Envelope>';

        let query = '/api/soap/mantisconnect.php';
        this.mantisUa.request(query, request, responseCallback);

        function responseCallback(response, httpCode) {
            let items = [];

            let xml = XML.parse(response);
            try {
                items = xml
                    .children[0] // SOAP-ENV:Envelope
                    .children[0] // SOAP-ENV:Body
                    .children[0] // ns1:mc_filter_search_issuesResponse
                    .children[0] // return
            } catch (err) {
                throw new Error('Failed to extract items from response', err);
            }

            let stories = items.
                map(function (item) {
                    return {
                        id: idField(item),
                        summary: summaryField(item),
                        handler: handlerField(item)
                    }
                })
                filter(function (item) {
                    return item.handler === handler;
                })
                sort(function (a, b) {
                    return a.id > b.id ? 1 : -1;
                })

            listCallback(stories)

            function itemField(item, field) {
                return item.children.reduce(function (previous, current) {
                    return previous || current.name === field && current;
                }, null)
            }

            function idField(item) {
                let id = itemField(item, 'id');
                return id && id.children[0].text
            }

            function summaryField(item) {
                let summary = itemField(item, 'summary');
                return summary && summary.children[0].text
            }

            function handlerField(item) {
                let handler = itemField(item, 'handler');
                return handler && handler.children[1].children[0].text
            }
        }
    }
});

