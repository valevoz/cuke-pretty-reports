import cucumber.api.scala.{EN, ScalaDsl}
import cucumber.api.{DataTable, Scenario}
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

  After("@screenshot") { scenario: Scenario =>
    val is = getClass.getResourceAsStream("NYC.jpg")
    scenario.embed(Stream.continually(is.read).takeWhile(-1 !=).map(_.toByte).toArray, "image/jpeg")
  }
}
