import React, { Component } from 'react';
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
        const {w, h, data} = this.props,
        margin = {
            left: w * 0.08,
            right: w * 0.20,
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
        bars.exit().remove();
        bars.enter().append("rect")
            .attr("class", "points-bar")
            .merge(bars)
            .attr("y", d => yScale(d.teamId))
            .attr("width", d => xScale(d.pointsFor / maxScore))
            .attr("height", barSpacing * 0.95)
            .attr("fill", colors.barGrey);
        // point labels
        var labels = chart.selectAll(".points-label")
            .data(data);
        labels.exit().remove();
        labels.enter().append("text")
            .attr("class", "points-label")
            .merge(labels)
            .text(d => d3.format(".1f")(d.pointsFor))
            .attr("x", d => xScale(d.pointsFor / maxScore) - 5)
            .attr("y", d => yScale(d.teamId) + (0.6 * yScale.bandwidth()))
            .attr("font-size", barSpacing / 3)
            //.attr("fill", "white")
            .attr("text-anchor", "end");
        // record labels
        var records = chart.selectAll(".record-label")
            .data(data);
        records.exit().remove();
        records.enter().append("text")
            .attr("class", "record-label")
            .merge(records)
            .text(d => `${d.totalWins}-${d.totalLosses}-${d.ties}`)
            .attr("x", 5)
            .attr("y", d => yScale(d.teamId) + (0.6 * yScale.bandwidth()))
            .attr("font-size", barSpacing / 3)
            .attr("font-weight", "bold")
            //.attr("fill", "white")
            .attr("text-anchor", "start");
        // ppw labels
        //const ppwVals = data.map(d => d.pointsFor / d.wins),
              //ppwExt = d3.extent(ppwVals),
              //ppwRange = ppwExt[1] - ppwExt[0],
              //ppwScale = (x) => ((x - ppwExt[0]) / ppwRange);
        //var ppw = chart.selectAll(".ppw-label")
            //.data(data);
        //ppw.exit().remove();
        //ppw.enter().append("text")
            //.attr("class", "ppw-label")
            //.merge(ppw)
            //.text(function(d) { 
                //let val = d.pointsFor / d.wins;
                //return d3.format(".1f")(val) + " pts/W"
            //})
            //.attr("x", width + 5)
            //.attr("y", d => yScale(d.teamId) + (0.6 * yScale.bandwidth()))
            //.attr("font-size", barSpacing / 3)
            //.attr("font-weight", "bold")
            //.attr("fill", d => d3.interpolateRdYlGn(ppwScale(d.pointsFor / d.wins)))
            //.attr("text-anchor", "start");
    }

    render() {
        if (!this.props.data) return <div />
        const {w, h} = this.props;
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
