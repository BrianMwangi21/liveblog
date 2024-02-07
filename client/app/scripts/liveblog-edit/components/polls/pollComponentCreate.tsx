import React from 'react';
import './pollComponent.scss';

interface IState {
    options: string[];
}

export default class PollComponentCreate extends React.Component<{}, IState> {
    constructor(props) {
        super(props);

        this.state = {
            options: ['Option 1', 'Option 2'],
        };
    }

    addOption = () => {
        this.setState((prev) => ({
            options: [...prev.options, `Option ${prev.options.length + 1}`],
        }));
    }

    render() {
        const { options } = this.state;

        return (
            <div className="poll_component poll_column poll_gap_16">
                <p className="poll_component_title">Create poll</p>

                <div id="poll_question">
                    <p className="poll_component_subtitle">QUESTION:</p>
                    <input type="text" placeholder="Ask A Question..." />
                </div>

                <div id="poll_options">
                    <p className="poll_component_subtitle">ANSWERS:</p>
                    <div className="poll_flex_box poll_column poll_gap_8">
                        {options.map((option, index) => {
                            return (
                                <input key={index} type="text" placeholder={option} />
                            );
                        })}
                        <p className="poll_option_add" onClick={this.addOption}>+ Add Option</p>
                    </div>
                </div>

                <div id="poll_settings">
                    <p className="poll_component_title">Poll length:</p>
                    <div className="poll_flex_box poll_row poll_gap_8">

                        <div className="poll_flex_box poll_column poll_gap_4">
                            <p className="poll_component_subtitle">DAYS:</p>
                            <input type="number" placeholder="1" />
                        </div>

                        <div className="poll_flex_box poll_column poll_gap_4">
                            <p className="poll_component_subtitle">HOURS:</p>
                            <input type="number" placeholder="0" />
                        </div>

                        <div className="poll_flex_box poll_column poll_gap_4">
                            <p className="poll_component_subtitle">MINUTES:</p>
                            <input type="number" placeholder="0" />
                        </div>

                    </div>
                </div>

                <button className="btn poll_reset_button">RESET POLL</button>
            </div>
        );
    }
}