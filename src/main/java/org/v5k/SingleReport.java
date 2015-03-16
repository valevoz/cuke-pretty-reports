package org.v5k;

import cucumber.runtime.io.URLOutputStream;
import cucumber.runtime.io.UTF8OutputStreamWriter;
import gherkin.formatter.JSONFormatter;

import java.io.IOException;
import java.net.URL;

public class SingleReport extends JSONFormatter {

    public SingleReport(URL destination) throws IOException {
        super(new UTF8OutputStreamWriter(new URLOutputStream(new URL(destination, "data1.json"))));
        Preparer.copyReportFiles(destination);
    }
}
