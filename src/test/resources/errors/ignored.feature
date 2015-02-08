@ignore
Feature: Ignored feature
  As a User
  I want to action
  So that benefit

  Scenario Outline: A + B
    Given <a> and <b> as input
    Then the result should equal to <sum>

  Examples:
    | a | b | sum |
    | 0 | 0 | 0   |
