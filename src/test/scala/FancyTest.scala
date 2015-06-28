import cucumber.api.CucumberOptions
import cucumber.api.junit.Cucumber
import org.junit.runner.RunWith

@RunWith(classOf[Cucumber])
@CucumberOptions(tags = Array("~@ignore"),
  plugin = Array(
    "org.v5k.SingleReport:target/single",
    "org.v5k.MultiReport:target/multi"
  ))
class FancyTest