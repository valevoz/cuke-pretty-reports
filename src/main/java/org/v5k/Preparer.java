package org.v5k;

import cucumber.runtime.io.URLOutputStream;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class Preparer {

    private static final String ROOT = "/pretty-report";
    private static final String[] FILES = new String[]{"app.min.css", "app.min.js", "favicon.ico", "index.html"};

    static void copyReportFiles(URL destination) {
        for (String file : FILES) {
            InputStream fileStream = Preparer.class.getResourceAsStream(ROOT + "/" + file);
            try {
                IOUtils.copy(fileStream, new URLOutputStream(new URL(destination, file)));
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }
    }
}
