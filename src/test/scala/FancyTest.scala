import cucumber.api.CucumberOptions
import cucumber.api.junit.Cucumber
import org.junit.runner.RunWith

@RunWith(classOf[Cucumber])
@CucumberOptions(tags = Array("~@ignore"),
  plugin = Array(
    "html:target/html",
    "gherkin.formatter.JSONPrettyFormatter:src/main/web/pretty-json.json",
    "org.v5k.HtmlPrettyFormatter:target/cuke-pretty-reports"
  ))
class FancyTest