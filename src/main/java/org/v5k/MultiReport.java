package org.v5k;

import cucumber.runtime.io.URLOutputStream;
import cucumber.runtime.io.UTF8OutputStreamWriter;
import gherkin.formatter.JSONFormatter;

import java.io.IOException;
import java.net.URL;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class MultiReport extends JSONFormatter {

    private static final AtomicInteger index = new AtomicInteger(0);
    private static final AtomicBoolean isFirst = new AtomicBoolean(true);

    public MultiReport(URL destination) throws IOException {
        super(new UTF8OutputStreamWriter(new URLOutputStream(new URL(destination, "data" + index.incrementAndGet() + ".json"))));

        if (isFirst.getAndSet(false)) {
            Preparer.copyReportFiles(destination);
        }
    }

}
