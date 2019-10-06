import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import { colors } from '../styles/constants.js';

class Histogram extends Component {
    constructor(props) {
        super(props);
        this.updateChart = this.updateChart.bind(this);
        this.updateMarkers = this.updateMarkers.bind(this);
        this.config = {
            xScale: d3.scaleLinear(),
            yScale: d3.scaleLinear(),
        };
        this.config.xAxis = d3.axisBottom(this.config.xScale)
            .tickSizeOuter(0);
        this.state = {
            w: null,
            h: null
        }
    }


    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.updateChart();
        }
        if (prevProps.selectedTeam !== this.props.selectedTeam) {
            this.updateMarkerColor();
        }
    }

    updateMarkers() {
        const chart = d3.select(this.svg).select(".chart");
        const {xScale, yScale} = this.config;
        var markers = chart.selectAll(".marker")
            .data(this.props.data);
        markers.enter().append("circle")
            .attr("class", "marker")
            .merge(markers)
            .attr("cx", d => xScale(d.value))
            .attr("cy", yScale(0))
            .attr("r", 4)
            .style("opacity", 0.1);
        markers.exit().remove();
        this.updateMarkerColor();
    }

    updateMarkerColor() {
        const teamId = this.props.selectedTeam,
              chart = d3.select(this.svg).select(".chart");
        chart.selectAll(".marker")
            .style("opacity", d => d.teamId === teamId ? 1.0 : 0.25)
            .style("fill", d => d.teamId === teamId ? colors.selectionRed : "black");
    }

    updateChart() {
        if (!this.props.data) return;
        const w = ReactDOM.findDOMNode(this).offsetWidth * 0.9,
              h = 0.8 * w;
        this.setState({w: w, h: h});
        const margin = {
            left: w * 0.05,
            right: w * 0.02,
            top: h * 0.02,
            bottom: h * 0.10,
        },
        width = w - margin.left - margin.right,
        height = h - margin.bottom - margin.top,
        units = this.props.units,
        {xScale, yScale, xAxis} = this.config,
        node = this.svg,
        chart = d3.select(node).select(".chart");

        chart.attr("transform", `translate(${margin.left}, ${margin.top})`);
        chart.select(".x-axis")
            .attr("transform", `translate(0, ${height})`)
            .select(".axis-label")
            .datum(units)
            .attr("class", "axis-label")
            .attr("x", width/2)
            .attr("y", margin.bottom * 0.9)
            .text(d => d)
            .attr("fill", "black")
            .attr("font-size", 10);
        const values = this.props.data.map(d => d.value);
        var extent = d3.extent(values);
        extent[1]++;
        xScale
            .domain(extent).nice()
            .range([0, width]);
        const hist = d3.histogram()
            .domain(xScale.domain())
            .thresholds(xScale.ticks(10))(values);
        this.config.yScale
            .domain([0, d3.max(hist, d => d.length)]).nice()
            .range([height, 0]);
        var bars = chart.selectAll("rect")
            .data(hist);
        bars.enter().append("rect")
            .merge(bars)
            .transition().duration(300)
            .attr("x", d => xScale(d.x0) + 1)
            .attr("y", d => yScale(d.length) - 1)
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
            .attr("height", d => yScale(0) - yScale(d.length))
            .style("fill", colors.barGrey)
            .style("stroke", "white");
        bars.exit().remove();
        chart.select(".x-axis").call(xAxis.ticks(Math.floor(width / 40)));
        this.updateMarkers();
    }

    render() {
        if (!this.props.data) return <div />
        const {w, h} = this.state;
        return (
            <div className="viz-item">
                <h2>Score Distribution</h2>
                <svg width={w} height={h} ref={node => this.svg = node}>
                    <g className="chart">
                        <g className="x-axis">
                            <text className="axis-label" />
                        </g>
                    </g>
                </svg>
            </div>
        )
    }
}

export default Histogram;
