import cucumber.api.DataTable
import cucumber.api.scala.{EN, ScalaDsl}
import org.junit.Assert._

class FancyStepDefinition extends ScalaDsl with EN {

  var a: Int = _
  var b: Int = _
  var result: Int = _


  Given("^input") {}

  Given("^table") { table: DataTable =>}

  Given("^(.+) and (.+) as input$") { (a: Int, b: Int) =>
    this.a = a
    this.b = b
  }

  When("^action") {}

  Then("^the result should equal to (.+)$") { result: Int =>
    assertEquals(result, a + b)
  }

  Then("^result$") {}
}
