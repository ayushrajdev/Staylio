package helpers

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

var supportedVersions = map[string]bool{
	"v1": true,
	"v2": true,
}

func CreateVersionedProxy(
	target string,
	resource string,
) http.HandlerFunc {

	targetURL, err := url.Parse(target)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	originalDirector := proxy.Director

	proxy.Director = func(req *http.Request) {

		originalDirector(req)

		version := req.Header.Get("X-Api-Version")

		if version == "" {
			version = "v1"
		}


		// Don't forward this header to the microservice
		req.Header.Del("X-Api-Version")

		sourcePrefix := "/api/" + resource
		targetPrefix := "/api/" + version + "/" + resource

		req.URL.Path = strings.Replace(
			req.URL.Path,
			sourcePrefix,
			targetPrefix,
			1,
		)

		req.URL.RawPath = req.URL.Path
	}

	return proxy.ServeHTTP
}
