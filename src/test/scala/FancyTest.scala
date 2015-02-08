import cucumber.api.CucumberOptions
import cucumber.api.junit.Cucumber
import org.junit.runner.RunWith

@RunWith(classOf[Cucumber])
@CucumberOptions(tags = Array("~@ignore"),
  plugin = Array(
    "html:target/html",
    "json:target/json.json",
    "gherkin.formatter.JSONPrettyFormatter:target/pretty-json.json"
  ))
class FancyTest