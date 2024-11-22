import React from "react";

function ScriptGenerator({ device }) {
    const script = `
location / {
    proxy_pass http://${device.ip}:8080; # Pas dit aan naar de interne URL van je applicatie
    access_log /data/logs/access.log;
    error_log /data/logs/error.log;

    # Stuur een verzoek naar de WOL webserver
    access_by_lua_block {
        local handle = io.popen("curl -s http://127.0.0.1:5001/api/wake/${device.id} -X POST")
        local result = handle:read("*a")
        ngx.log(ngx.ERR, "WOL script output: " .. result)
        handle:close()
    }
}
`.trim();

    return (
        <div>
            <h2 className="text-xl font-bold mb-3">Gegenereerd Nginx-script</h2>
            <textarea
                readOnly
                value={script}
                className="w-full h-40 p-2 border rounded"
            />
            <button
                onClick={() => navigator.clipboard.writeText(script)}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Kopieer script
            </button>
        </div>
    );
}

export default ScriptGenerator;
