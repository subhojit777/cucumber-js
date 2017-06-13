import SummaryFormatter from './summary_formatter'
import PrettyFormatter from './pretty_formatter'
import indentString from 'indent-string'
import figures from 'figures'
import Status from '../status'
import Hook from '../models/hook'
import DataTable from '../models/step_arguments/data_table'
import DocString from '../models/step_arguments/doc_string'

export default class VerboseSummaryFormatter extends SummaryFormatter {
  resetScenarioStepsOutput() {
    this.scenarioStepsOutput = ''
  }

  formatTags(tags) {
    if (tags.length === 0) {
      return ''
    }
    const tagNames = tags.map((tag) => tag.name)
    return this.colorFns.tag(tagNames.join(' '))
  }

  logIndented(text, level) {
    this.log(indentString(text, level * 2))
  }

  handleStepResult(stepResult) {
    if (!(stepResult.step instanceof Hook)) {
      this.storeStepResult(stepResult)
    }
  }

  handleBeforeScenario(scenario) {
    this.resetScenarioStepsOutput()
  }

  handleAfterScenario(scenario) {
    let text = ''
    let tagsText = this.formatTags(scenario.tags)
    if (tagsText) {
      text = tagsText + '\n'
    }
    text += indentString(scenario.keyword + ': ' + scenario.name + '\n', 2)

    text += this.scenarioStepsOutput

    this.logIndented(text, 1)
  }

  storeStepResult(stepResult) {
    const {status, step} = stepResult
    const colorFn = this.colorFns[status]

    const symbol = VerboseSummaryFormatter.CHARACTERS[stepResult.status]
    const identifier = colorFn(symbol + ' ' + step.keyword + (step.name || ''))
    this.scenarioStepsOutput += indentString(identifier + '\n', 2)

    step.arguments.forEach((arg) => {
      let str
      if (arg instanceof DataTable) {
        str = this.formatDataTable(arg)
      } else if (arg instanceof DocString) {
        str = this.formatDocString(arg)
      } else {
        throw new Error('Unknown argument type: ' + arg)
      }
      this.scenarioStepsOutput += indentString(colorFn(str) + '\n', 6)
    })
  }
}

VerboseSummaryFormatter.CHARACTERS = {
  [Status.AMBIGUOUS]: figures.cross,
  [Status.FAILED]: figures.cross,
  [Status.PASSED]: figures.tick,
  [Status.PENDING]: '?',
  [Status.SKIPPED]: '-',
  [Status.UNDEFINED]: '?'
}
