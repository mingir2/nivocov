import React from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import Countries from "./world_countries";
import toISO from "./toISO";
import COVIDContext from "./COVIDContext";

class Choropleth extends React.Component {
    static contextType = COVIDContext;

    constructor(props, context) {
        super(props);

        this.state = { daily: context.daily };
    }

    parseData(data) {
        let res = {};

        data.forEach(element => {
            const ISO = toISO[element["Country_Region"]];

            if (!ISO) console.log(element["Country_Region"]);
            if (!res[ISO]) {
                res[ISO] = {
                    id: ISO,
                    name: element["Country_Region"],
                    Confirmed: +element.Confirmed,
                    Deaths: +element.Deaths,
                    Recovered: +element.Recovered
                };
            } else {
                let country = res[ISO];
                country.Confirmed += +element.Confirmed;
                country.Deaths += +element.Deaths;
                country.Recovered += +element.Recovered;
            }
        });
        return Object.keys(res).map(function(key) {
            return res[key];
        });
    }

    onClick(data, event) {
        this.props.updateCountry(data.data.name);
    }

    render() {
        let max;
        if (this.context.type === "Confirmed") {
            max = 100000;
        } else if (this.context.type === "Recovered") {
            max = 20000;
        } else {
            max = 5000;
        }

        const data = this.parseData(this.state.daily) 

        return (
            <div className="map">
                <hr></hr>
                <span>Worldwide</span>
                <ResponsiveChoropleth
                    data={data}
                    features={Countries.features}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    colors="YlGnBu"
                    value={this.context.type}
                    domain={[0, max]}
                    unknownColor="#666666"
                    label="properties.name"
                    valueFormat=".2s"
                    projectionScale={175}
                    projectionTranslation={[0.5, 0.75]}
                    projectionRotation={[0, 0, 0]}
                    enableGraticule={true}
                    graticuleLineColor="#dddddd"
                    borderWidth={1}
                    borderColor="gray"
                    onClick={(data, event) => this.onClick(data, event)}
                    legends={[
                        {
                            anchor: "left",
                            direction: "column",
                            justify: true,
                            translateX: 20,
                            translateY: 90,
                            itemsSpacing: 0,
                            itemWidth: 94,
                            itemHeight: 18,
                            itemDirection: "left-to-right",
                            itemTextColor: "#444444",
                            itemOpacity: 0.85,
                            symbolSize: 18,
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemTextColor: "#000000",
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                ></ResponsiveChoropleth>
            </div>
        );
    }
}
export default Choropleth;
