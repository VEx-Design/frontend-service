import { evaluate } from "mathjs"

export interface Vertex {
    id: string                      //vertex id
    type: string                    //type id of vertex
    scope: Record<string, number>   //local variables in this vertex
    // input: Record<string, number>[] //input values in this vertex
    output: Record<string,number>[] //output values out of this vertex
}

export interface Edge {
    source: string      //source vertex id
    target: string      //target vertex id
    distance: number    //distance between source and targeti
    locked: boolean     //locked edge or not
}

export interface Graph {
    vertices: Vertex[]  //vertices
    edges: Edge[]       //edges
}

export interface Variable {
    name: string    //variable name
    symbol: string  //variable symbol
}

export interface Type {
    id: string              //type id
    name: string            //type name
    variables: Variable[]   //local variables in this type
    input: number           //number of input of this type
    output: number          //number of output of this type
}

export interface Configuration {
    id: string                 //configuration id
    parameters: string[]       //parameters that will be calculated
    equations: Record<string, Record<string, string>[]> //equations for each type
    freespace: Record<string, string> //freespace equations
}

export function createVertex(id: string, type: string, scope: Record<string, number>,output: Record<string,number>[]): Vertex {
    return { id, type, scope, output };
}

export function createEdge(source: string, target: string, distance: number, locked: boolean): Edge {
    return { source, target, distance, locked};
}

export function createGraph(vertices: Vertex[], edges: Edge[]): Graph {
    return { vertices, edges };
}

export function createVariable(name: string, symbol: string): Variable {
    return { name, symbol };
}

export function createType(id: string, name: string, variables: Variable[], input: number, output: number): Type {
    return { id, name, variables, input, output };
}

export function createConfiguration(id: string, parameters: string[], equations: Record<string, Record<string, string>[]>, freespace: Record<string, string>): Configuration {
    return { id, parameters, equations, freespace };
}

export function inDegreeMap(g: Graph): Map<string, number> {
    let inDegree = new Map<string, number>()

    g.vertices.forEach((node: Vertex) => {
        inDegree.set(node.id, 0)
    });

    g.edges.forEach(edge => {
        let target = edge.target
        inDegree.set(target, (inDegree.get(target) || 0) + 1)
    });

    return inDegree
}

export function tSort(g: Graph): string[] {
    let inDegree = inDegreeMap(g)
    let tSort: string[] = []
    let queue: string[] = []

    inDegree.forEach((degree, vertex) => {
        if (degree === 0) {
            queue.push(vertex)
        }
    });

    while (queue.length > 0) {
        let vertex = queue.shift()!
        tSort.push(vertex)
        let edges = g.edges.filter(edge => edge.source === vertex)
        edges.forEach(edge => {
            let target = edge.target
            inDegree.set(target, (inDegree.get(target) || 0) - 1)
            if (inDegree.get(target) === 0) {
                queue.push(target)
            }
        })
    }

    return tSort
}

export function calculate(g: Graph, c: Configuration): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};
    const inDegree = inDegreeMap(g);
    const vertices = tSort(g).filter(vertex => inDegree.get(vertex) !== 0);
    

    for (const vertexId of vertices) {
        const vertex = g.vertices.find(v => v.id === vertexId)!;
        const freespace: Record<string, number> = {};
        const value: Record<string, number> = {};

        // Gather input values from previous vertices
        const inputs: Record<string, number> = {};
        g.edges.filter(edge => edge.target === vertexId).forEach(edge => {
            const sourceVertex = g.vertices.find(v => v.id === edge.source)!;
            const lastOutput = sourceVertex.output[sourceVertex.output.length - 1] || {};
            for (const key in lastOutput) {
                inputs[key] = lastOutput[key];
            }
            inputs['distance'] = edge.distance;
        });

        // Calculate freespace (always calculated)
        for (const param of c.parameters) {
            try {
                freespace[param] = evaluate(c.freespace[param], inputs);
            } catch (error) {
                console.error(`Error evaluating freespace for ${vertexId} and parameter ${param}:`, error);
                freespace[param] = 0;
            }
        }

        // Calculate output values ONLY if not an "end" vertex
        if (vertex.type !== "end") {
            for (const param of c.parameters) {
                try {
                    value[param] = evaluate(c.equations[vertex.type][0][param], { ...freespace, ...vertex.scope });
                } catch (error) {
                    console.error(`Error evaluating equation for ${vertexId} and parameter ${param}:`, error);
                    value[param] = 0;
                }
            }
            result[vertexId] = value;
            vertex.output.push(value); // Store the output in the vertex
        } else {
          result[vertexId] = freespace; //for end vertex, the result is freespace
          vertex.output.push(freespace)
        }
    }

    return result;
}
