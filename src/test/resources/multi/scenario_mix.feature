Feature: Mix Of Scenarios
  As a User
  I want to action
  So that benefit

  Scenario: A + B
    Given 2 and 2 as input
    When action
    Then the result should equal to 5


  Scenario Outline: X + Y
    Given <a> and <b> as input
    When action
    Then the result should equal to <sum>

  Examples:
    | a   | b | sum  |
    | 1   | 2 | 3    |
    | 999 | 1 | 1000 |