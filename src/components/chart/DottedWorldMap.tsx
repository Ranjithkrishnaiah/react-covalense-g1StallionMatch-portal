import { useState } from "react";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import { MapContainer, ImageOverlay, CircleMarker } from "react-leaflet";
import DottedMap from "dotted-map";
import "./App.css";
import { Stack } from "@mui/material";
import { useBreederReportWorldMapQuery }  from 'src/redux/splitEndpoints/getBreederActivitySplit';

const map = new DottedMap({ height: 60, grid: "vertical" });
const svgMap = map.getSVG({
  radius: 0.22,
  color: "#B0B6AF",
  shape: "circle",
  backgroundColor: "#fff",
});

const { region } = map.image;

const bounds: [number, number][] = [
  [region.lat.min, region.lng.min],
  [region.lat.max, region.lng.max],
];

const Map = styled(MapContainer)`
  height: 100vh;
  width: 100vw;
`;
const Tooltip = styled.div`
  position: fixed;
  top: 100px;
  left: 100px;
  z-index: 100000;
  color: #161716;  
  font-weight: 350;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid #E2E7E1;
  background: #FFFFFF;
  pointer-events: none;
  padding: 6px 7px 7px 11px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
`;

type BreederReportProps = {
  id: string;
  fromDate: string;
  toDate: string;
  dateRangeType: string;
};

const DottedWorldMap = (props: BreederReportProps) => {

  const { id, fromDate, toDate, dateRangeType } = props;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [displayedColiving, setDisplayedColiving] = useState<any>(null);
  const [tooltipCoords, setTooltipCoords] = useState({ top: 0, left: 0 });

  const [isCustomDate, setIsCustomDate] = useState<any>(dateRangeType === 'custom' ? false : true);
  const mapReqest = (isCustomDate) ? {farmId: id, 'fromDate': fromDate, 'toDate': toDate, 'filterBy': dateRangeType} : {farmId: id, 'filterBy': dateRangeType}
  // Breeder report world map API call
  const { data: worldmapAPIData, error, isFetching, isLoading: isWorldMapLoading, isSuccess:isWorldMapSuccess } = useBreederReportWorldMapQuery(mapReqest);
  
  return (
    <>
    <div className="dottedMapmain">
      <Map
        className="dottedMap"
        center={[15, 6.143158]}
        zoom={2}
        maxZoom={6}
        minZoom={2}
        attributionControl={false}
        zoomControl={false}
      >
        <ImageOverlay
            url={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`} 
            bounds={bounds}
        />
        {worldmapAPIData?.map((coliving: any) => {
          const isColivingDisplayed =
            coliving === displayedColiving && isTooltipVisible;
          const isAnotherColivingDisplayed =
            !isColivingDisplayed && isTooltipVisible;
          const [lat, lng] = coliving.location;
          const pin = map.getPin({ lat, lng });
 
          return (
            <CircleMarker
              center={[pin.lat, pin.lng]}
              radius={4}
              pathOptions={{
                fillColor: isColivingDisplayed ? "#2EFFB4" : "#2EFFB4",
                color: "transparent",
                fillOpacity: isAnotherColivingDisplayed ? 0.6 : 1,
              }}
              key={coliving.website}
              eventHandlers={{
                mouseover: (e: any) => {
                  setTooltipCoords({
                    top: e.originalEvent.clientY,
                    left: e.originalEvent.clientX,
                  });
                  setDisplayedColiving(coliving);
                  setIsTooltipVisible(true);
                },
                mouseout: () => {
                  setIsTooltipVisible(false);
                },
                click: () => window.open(coliving.website, "_blank"),
              }}
            />
          );
        })}
      </Map>
      {/* Tooltip used to display the session count, Registered Users and Anonymous Users */}
      <Tooltip   
      className="mapTooltip"     
        style={{
          position: "fixed",
          top: tooltipCoords.top+"px",
          left: tooltipCoords.left+"px",
          zIndex: 100000,
          color: "#161716",  
          fontWeight: 350,
          fontSize: "14px",
          lineHeight: "20px",
          border: "1px solid #E2E7E1",
          background: "#FFFFFF",
          pointerEvents: "none",
          padding:'0px',
          boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)",
          borderRadius: "8px",
          opacity: (isTooltipVisible) ? 1 : 0,
        }
      }
      >
        <Stack className='Tooltipmapbox'>
            <Stack>{displayedColiving?.Sessions} Sessions</Stack>
            <Stack>{displayedColiving?.registeredUsers} Registered Users</Stack>
            <Stack>{displayedColiving?.AnonymousUsers} Anonymous Users</Stack>
        </Stack>
      </Tooltip>
      {/* End Tooltip used to display the session count, Registered Users and Anonymous Users */}
    </div>
    </>
  );
};

export default DottedWorldMap;