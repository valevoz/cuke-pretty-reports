package com.v5k

import java.util

import gherkin.formatter.Formatter
import gherkin.formatter.model._

class FancyFormatter extends Formatter {

  override def uri(uri: String): Unit = ???

  override def feature(feature: Feature): Unit = ???

  override def syntaxError(state: String, event: String, legalEvents: util.List[String], uri: String, line: Integer): Unit = ???

  override def endOfScenarioLifeCycle(scenario: Scenario): Unit = ???

  override def scenario(scenario: Scenario): Unit = ???

  override def startOfScenarioLifeCycle(scenario: Scenario): Unit = ???

  override def done(): Unit = ???

  override def scenarioOutline(scenarioOutline: ScenarioOutline): Unit = ???

  override def background(background: Background): Unit = ???

  override def close(): Unit = ???

  override def step(step: Step): Unit = ???

  override def examples(examples: Examples): Unit = ???

  override def eof(): Unit = ???
}