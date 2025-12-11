export function convertJsonToBpmnXml(json: any): string {
    const definitions = json.definitions?.process;
    if (!definitions) return "";

    const processId = definitions.id || "Process_1";
    let shapes = "";
    let edges = "";
    let flowElements = "";
    let categories = ""; // LaneSets

    // Helper to generate IDs
    const ensureId = (el: any, prefix: string) => el.id || `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

    // Handle Lanes (Categories)
    if (definitions.laneSets) {
        definitions.laneSets.forEach((laneSet: any) => {
            let lanes = "";
            laneSet.lanes.forEach((lane: any) => {
                const laneId = ensureId(lane, "Lane");
                const flowNodeRefs = lane.flowNodeRef?.map((ref: string) => `<bpmn:flowNodeRef>${ref}</bpmn:flowNodeRef>`).join("") || "";
                lanes += `<bpmn:lane id="${laneId}" name="${lane.name}">${flowNodeRefs}</bpmn:lane>`;
                
                // Add graphics for Lane
                shapes += `<bpmndi:BPMNShape id="${laneId}_di" bpmnElement="${laneId}" isHorizontal="true">
                    <dc:Bounds x="160" y="80" width="600" height="250" />
                </bpmndi:BPMNShape>`;
            });
            categories += `<bpmn:laneSet id="${ensureId(laneSet, "LaneSet")}">${lanes}</bpmn:laneSet>`;
        });
    }

    // Handle Flow Elements (Tasks, Events, Gateways)
    let x = 200;
    definitions.flowElements?.forEach((el: any) => {
       const id = ensureId(el, "Element");
       const name = el.name || "";
       const type = el.type || "task"; // startEvent, endEvent, task, exclusiveGateway
       
       let bpmnType = "bpmn:task";
       let width = 100;
       let height = 80;

       if (type === 'startEvent') { bpmnType = "bpmn:startEvent"; width = 36; height = 36; }
       else if (type === 'endEvent') { bpmnType = "bpmn:endEvent"; width = 36; height = 36; }
       else if (type === 'exclusiveGateway') { bpmnType = "bpmn:exclusiveGateway"; width = 50; height = 50; }
       
       const incoming = el.incoming?.map((ref: string) => `<bpmn:incoming>${ref}</bpmn:incoming>`).join("") || "";
       const outgoing = el.outgoing?.map((ref: string) => `<bpmn:outgoing>${ref}</bpmn:outgoing>`).join("") || "";

       flowElements += `<${bpmnType} id="${id}" name="${name}">${incoming}${outgoing}</${bpmnType}>`;

       // Basic DI (Auto layout simple horizontal)
       shapes += `<bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}">
        <dc:Bounds x="${x}" y="100" width="${width}" height="${height}" />
       </bpmndi:BPMNShape>`;
       
       x += 150;
    });

    // Handle Sequence Flows
    definitions.sequenceFlows?.forEach((flow: any) => {
        const id = ensureId(flow, "Flow");
        flowElements += `<bpmn:sequenceFlow id="${id}" sourceRef="${flow.sourceRef}" targetRef="${flow.targetRef}" />`;
        
        // Simple Edge DI - totally mock coordinates, bpmn-js might auto-route or look ugly without layout engine
        // Getting coordinates right manually is hard. Ideally we use a layout library or just let the viewer handle simple connections if possible.
        // For simplicity, we just add the element. bpmn-js usually needs DI for everything to render visible.
        edges += `<bpmndi:BPMNEdge id="${id}_di" bpmnElement="${id}">
            <di:waypoint x="0" y="0" />
            <di:waypoint x="0" y="0" />
        </bpmndi:BPMNEdge>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${processId}" isExecutable="false">
    ${categories}
    ${flowElements}
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
      ${shapes}
      ${edges}
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
}
