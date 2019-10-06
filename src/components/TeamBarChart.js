import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import { colors } from '../styles/constants';

class TeamBarChart extends Component {

    constructor() {
        super()
        this.config = {
            xScale: d3.scaleLinear(),
            yScale: d3.scaleBand()
        }
        this.config.yAxis = d3.axisLeft(this.config.yScale)
            .tickSizeOuter(0)
            .tickSizeInner(0);
        this.state = {
            w: null,
            h: null
        }
    }

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.data !== this.props.data)
            || (prevProps.pointsWins !== this.props.pointsWins)) {
            this.updateChart();
        }
        if (prevProps.selectedTeam !== this.props.selectedTeam) {
            this.updateBarColor();
        }
    }

    updateBarColor() {
        const teamId = this.props.selectedTeam,
              chart = d3.select(this.svg).select(".chart");
        chart.selectAll(".points-bar")
            .style("fill", d => d.teamId === teamId ? colors.selectionRed : colors.barGrey);
    }

    updateChart() {
        if (!this.props.data) return;
        const { data } = this.props;
        const w = ReactDOM.findDOMNode(this).offsetWidth * 0.9,
              h = 0.9 * w;
        this.setState({w: w, h: h});
        const margin = {
            left: w * 0.10,
            right: w * 0.01,
            top: h * 0.02,
            bottom: h * 0.01,
        },
        width = w - margin.left - margin.right,
        height = h - margin.bottom - margin.top;
        const {xScale, yScale, yAxis} = this.config,
              extent = d3.extent(data.map(d => d.pointsFor)),
              maxScore = extent[1],
              barSpacing = height / data.length;
        extent[0] *= 0.90;
        xScale.domain([0, 1])
            .range([0, width]);
        var ids = data.map(d => d.teamId);
        yScale.domain(ids.reverse())
            .rangeRound([height, 0]);
        const chart = d3.select(this.svg).select(".chart");
        chart.attr("transform", `translate(${margin.left}, ${margin.top})`);
        var abbrevMap = {};
        data.forEach(d => { abbrevMap[d.teamId] = d.abbrev});
        yAxis.tickFormat(d => abbrevMap[parseInt(d)]);
        chart.select(".team-axis").call(yAxis).call(g => g.select(".domain").remove());
        // point bars
        var bars = chart.selectAll(".points-bar")
            .data(data);
        bars.enter().append("rect")
            .attr("class", "points-bar")
            .merge(bars)
            .transition().duration(300)
            .attr("y", d => yScale(d.teamId))
            .attr("width", d => xScale(d.pointsFor / maxScore))
            .attr("height", barSpacing * 0.95)
            .attr("fill", colors.barGrey);
        // point labels
        bars.exit().remove();
        var labels = chart.selectAll(".points-label")
            .data(data);
        labels.enter().append("text")
            .attr("class", "points-label")
            .merge(labels)
            .text(d => d3.format(".1f")(d.pointsFor))
            .attr("x", d => xScale(d.pointsFor / maxScore) - 5)
            .attr("y", d => yScale(d.teamId) + (0.6 * yScale.bandwidth()))
            .attr("font-size", barSpacing / 3)
            //.attr("fill", "white")
            .attr("text-anchor", "end");
        labels.exit().remove();
        // record labels
        var records = chart.selectAll(".record-label")
            .data(data);
        records.enter().append("text")
            .attr("class", "record-label")
            .merge(records)
            .text(d => `${d.totalWins}-${d.totalLosses}-${d.ties}`)
            .attr("x", 5)
            .attr("y", d => yScale(d.teamId) + (0.6 * yScale.bandwidth()))
            .attr("font-size", barSpacing / 3)
            .attr("font-weight", "bold")
            .attr("text-anchor", "start");
        records.exit().remove();
    }

    render() {
        if (!this.props.data) return <div />
        const {w, h} = this.state;
        return (
            <div className="viz-item">
                <h2>Total Points</h2>
                <svg width={w} height={h} ref={node => this.svg = node}>
                    <g className="chart">
                        <g className="team-axis" />
                    </g>
                </svg>
            </div>
        )
    }

}

export default TeamBarChart;
