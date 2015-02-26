package org.v5k;

import cucumber.runtime.io.URLOutputStream;
import cucumber.runtime.io.UTF8OutputStreamWriter;
import gherkin.formatter.JSONFormatter;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.net.URL;

public class HtmlPrettyFormatter extends JSONFormatter {


    private static final File ROOT = new File("pretty-report");

    private final URL parent;

    public HtmlPrettyFormatter(URL parent) throws IOException {
        super(new UTF8OutputStreamWriter(new URLOutputStream(new URL(parent, "data.json"))));
        this.parent = parent;
    }

    @Override
    public void done() {
        super.done();
        copyReportFiles();
    }

    private void copyReportFiles() {
        try {
            FileUtils.copyDirectory(ROOT, new File(parent.getPath()));
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
