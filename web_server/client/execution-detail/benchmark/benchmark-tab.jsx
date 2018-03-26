import React from "react";
import {connect} from "react-redux";
import {Container} from "reactstrap";
import {PropTypes} from "prop-types";
import {fetchExecutionMethodSummaries} from "../../execution/execution-action";
import {executionMethodSummarySelector} from "../../execution/execution-reducer";
import {dataSelector, isLoadingSelector} from "../../service/repository";
import {LoadingIndicator} from "../../components/loading-indicator";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from "recharts";

const PerformanceGraph = ({data, methods}) => {
    return (
        <ResponsiveContainer width='80%' height={600}>
            <LineChart data={data}
                       margin={{
                           "top": 5,
                           "right": 30,
                           "left": 20,
                           "bottom": 5
                       }}>
                <XAxis dataKey="split"/>
                <YAxis domain={[0, 1]}
                       ticks={[0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}>
                    <Label angle={-90} value="AUC" position='insideLeft' style={{textAnchor: 'middle'}}/>
                </YAxis>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
                {methods.map((method, index) => (
                    <Line
                        key={method}
                        type="monotone"
                        dataKey={method}
                        stroke={getColor(index)}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer >
    );
};


const getColor = (() => {
    const colors = [];
    return (index) => {
        while(index >= colors.length) {
            colors.push(getNextColor());
        }
        return colors[index];
    };
})();

// http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically
const getNextColor = (() => {
    const golden_ratio_conjugate = 0.618033988749895;
    // Fixed "random" seed to always get the same sequence.
    let h = 0.4176;

    const hslToRgb = (h, saturation, lightness) => {
        let r, g, b;

        if (saturation == 0) {
            r = g = b = lightness; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            const q = lightness < 0.5 ?
                lightness * (1 + saturation) :
                lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return '#' +
            Math.round(r * 255).toString(16) +
            Math.round(g * 255).toString(16) +
            Math.round(b * 255).toString(16);
    };

    return () => {
        h += golden_ratio_conjugate;
        h %= 1;
        return hslToRgb(h, 0.9, 0.6);
    };
})();


class _BenchmarkTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {};
    }

    componentWillMount() {
        this.props.loadSummaries();
    }

    render() {
        if (this.props.isLoading) {
            return (
                <LoadingIndicator/>
            )
        }

        const style = {
            "margin": "1REM",
            "padding": "1REM"
        };

        let data = undefined;
        let methods = [];
        for (let methodId in this.props.summaries) {
            methods.push(methodId);
            const summary = this.props.summaries[methodId];
            if (data === undefined) {
                data = [];
                // TODO For now we assume all runs are in same order.
                summary["runs"].forEach(run => {
                    data.push({
                        "split": run["split"],
                        "group": run["group"],
                        "selection": run["selection"],
                        "dataset": run["dataset"]
                    });
                });
            }
            for (let index = 0; index < data.length; ++index) {
                const run = summary["runs"][index];
                data[index][methodId] = run["evaluation"]["auc"];
            }
        }

        return (
            <Container fluid={true} style={style}>
                <PerformanceGraph data={data} methods={methods}/>
            </Container>
        )
    }

}

export const BenchmarkTab = connect(
    (state, ownProps) => {
        const summaries = {};
        let isLoading = false;
        Object.keys(ownProps.execution.methods).forEach((methodId) => {
            const entity = executionMethodSummarySelector(state, methodId);
            if (isLoadingSelector(entity)) {
                isLoading = true;
                return;
            }
            summaries[methodId] = dataSelector(entity);
        });
        return {
            "summaries": summaries,
            "isLoading": isLoading
        }
    },
    (dispatch, ownProps) => ({
        "loadSummaries": () => {
            dispatch(fetchExecutionMethodSummaries(ownProps.execution));
        }
    }))
(_BenchmarkTab);

BenchmarkTab.propTypes = {
    "execution": PropTypes.object.isRequired
};