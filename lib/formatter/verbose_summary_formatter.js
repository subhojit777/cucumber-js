'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _VerboseSummaryFormat;

var _summary_formatter = require('./summary_formatter');

var _summary_formatter2 = _interopRequireDefault(_summary_formatter);

var _pretty_formatter = require('./pretty_formatter');

var _pretty_formatter2 = _interopRequireDefault(_pretty_formatter);

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

var _figures = require('figures');

var _figures2 = _interopRequireDefault(_figures);

var _status = require('../status');

var _status2 = _interopRequireDefault(_status);

var _hook = require('../models/hook');

var _hook2 = _interopRequireDefault(_hook);

var _data_table = require('../models/step_arguments/data_table');

var _data_table2 = _interopRequireDefault(_data_table);

var _doc_string = require('../models/step_arguments/doc_string');

var _doc_string2 = _interopRequireDefault(_doc_string);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VerboseSummaryFormatter = function (_SummaryFormatter) {
  (0, _inherits3.default)(VerboseSummaryFormatter, _SummaryFormatter);

  function VerboseSummaryFormatter() {
    (0, _classCallCheck3.default)(this, VerboseSummaryFormatter);
    return (0, _possibleConstructorReturn3.default)(this, (VerboseSummaryFormatter.__proto__ || Object.getPrototypeOf(VerboseSummaryFormatter)).apply(this, arguments));
  }

  (0, _createClass3.default)(VerboseSummaryFormatter, [{
    key: 'resetScenarioStepsOutput',
    value: function resetScenarioStepsOutput() {
      this.scenarioStepsOutput = '';
    }
  }, {
    key: 'formatTags',
    value: function formatTags(tags) {
      if (tags.length === 0) {
        return '';
      }
      var tagNames = tags.map(function (tag) {
        return tag.name;
      });
      return this.colorFns.tag(tagNames.join(' '));
    }
  }, {
    key: 'logIndented',
    value: function logIndented(text, level) {
      this.log((0, _indentString2.default)(text, level * 2));
    }
  }, {
    key: 'handleStepResult',
    value: function handleStepResult(stepResult) {
      if (!(stepResult.step instanceof _hook2.default)) {
        this.storeStepResult(stepResult);
      }
    }
  }, {
    key: 'handleBeforeScenario',
    value: function handleBeforeScenario(scenario) {
      this.resetScenarioStepsOutput();
    }
  }, {
    key: 'handleAfterScenario',
    value: function handleAfterScenario(scenario) {
      var text = '';
      var tagsText = this.formatTags(scenario.tags);
      if (tagsText) {
        text = tagsText + '\n';
      }
      text += (0, _indentString2.default)(scenario.keyword + ': ' + scenario.name + '\n', 2);

      text += this.scenarioStepsOutput;

      this.logIndented(text, 1);
    }
  }, {
    key: 'storeStepResult',
    value: function storeStepResult(stepResult) {
      var _this2 = this;

      var status = stepResult.status,
          step = stepResult.step;

      var colorFn = this.colorFns[status];

      var symbol = VerboseSummaryFormatter.CHARACTERS[stepResult.status];
      var identifier = colorFn(symbol + ' ' + step.keyword + (step.name || ''));
      this.scenarioStepsOutput += (0, _indentString2.default)(identifier + '\n', 2);

      step.arguments.forEach(function (arg) {
        var str = void 0;
        if (arg instanceof _data_table2.default) {
          str = _this2.formatDataTable(arg);
        } else if (arg instanceof _doc_string2.default) {
          str = _this2.formatDocString(arg);
        } else {
          throw new Error('Unknown argument type: ' + arg);
        }
        _this2.scenarioStepsOutput += (0, _indentString2.default)(colorFn(str) + '\n', 6);
      });
    }
  }]);
  return VerboseSummaryFormatter;
}(_summary_formatter2.default);

exports.default = VerboseSummaryFormatter;


VerboseSummaryFormatter.CHARACTERS = (_VerboseSummaryFormat = {}, (0, _defineProperty3.default)(_VerboseSummaryFormat, _status2.default.AMBIGUOUS, _figures2.default.cross), (0, _defineProperty3.default)(_VerboseSummaryFormat, _status2.default.FAILED, _figures2.default.cross), (0, _defineProperty3.default)(_VerboseSummaryFormat, _status2.default.PASSED, _figures2.default.tick), (0, _defineProperty3.default)(_VerboseSummaryFormat, _status2.default.PENDING, '?'), (0, _defineProperty3.default)(_VerboseSummaryFormat, _status2.default.SKIPPED, '-'), (0, _defineProperty3.default)(_VerboseSummaryFormat, _status2.default.UNDEFINED, '?'), _VerboseSummaryFormat);