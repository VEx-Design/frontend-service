
import {evaluate} from "mathjs"

export interface Vertex {
    id: string                      //vertex id
    type: string                    //type id of vertex
    scope: Record<string, number>   //local variables in this vertex
    output: Record<string,number>[] //output values out of this vertex
}

export interface Edge {
    source: string      //source vertex id
    target: string      //target vertex id
    sourceInterface: number //source interface number
    targetInterface: number //target interface number
    distance: number    //distance between source and targeti
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

export function createVertex(id: string, type: string, scope: Record<string, number>, output: Record<string,number>[]): Vertex {
    return { id, type, scope, output };
}

export function createEdge(source: string, target: string, sourceInterface :number, targetInterface :number, distance: number): Edge {
    return { source, target, sourceInterface, targetInterface, distance};
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

// calculate the in-degree of each vertex
function inDegree(g: Graph): Map<string,number> {
    let inDegree = new Map<string,number>()

        g.vertices.forEach((node: Vertex) => {
        inDegree.set(node.id, 0)
    });

    g.edges.forEach(edge => {
        let target = edge.target
        inDegree.set(target, (inDegree.get(target) || 0) + 1)
    });

    return inDegree
}

// topological sort of the graph
function topologicalSort (g: Graph): string[]{
    let indegree = inDegree(g)
    let topologicalSort: string[] = []
    let queue: string[] = []

    indegree.forEach((degree, vertex) => {
        if (degree === 0) {
            queue.push(vertex)
        }
    });

    while (queue.length > 0) {
        let vertex = queue.shift()!
        topologicalSort.push(vertex)
        let edges = g.edges.filter(edge => edge.source === vertex)
        edges.forEach(edge => {
            let target = edge.target
            indegree.set(target, (indegree.get(target) || 0) - 1)
            if (indegree.get(target) === 0) {
                queue.push(target)
            }
        })
    }

    return topologicalSort

}

// function to calculate the freespace equations given the input and distance between two vertices
function freespaceCalculate(input: Record<string,number>, distance: number, c : Configuration): Record<string,number>{
    let result: Record<string, number> = {};
    let scope = new Map<string, number>();
    for (const key in input) {
        scope.set(key,input[key])
    }
    scope.set('distance',distance)
    c.parameters.forEach(param => {
        try {
            result[param] = evaluate(c.freespace[param], scope);
        } catch (error) {
            console.error(`Error evaluating freespace for ${param}:`, error);
        }
    })

    return result
}

// function to create scope for internal calculation of a vertex
function createInputScope(vertexID : string, graph : Graph, type : Type, configuration : Configuration): Map<string,number>{
    let result = new Map<string,number>()
    if(type.input === 1){
        let edges = graph.edges.filter(edge => edge.target === vertexID)
        let sourceVertex = graph.vertices.find(v => v.id === edges[0].source)!
        let newScope = freespaceCalculate(sourceVertex.output[edges[0].sourceInterface - 1],edges[0].distance,configuration)
        for (const key in newScope) {
            result.set(key,newScope[key])
        }
    }
    else{
        let edges = graph.edges.filter(edge => edge.target === vertexID)
        edges.forEach(edge => {
            let sourceVertext = graph.vertices.find(v => v.id === edge.source)!
            let newScope = freespaceCalculate(sourceVertext.output[edge.sourceInterface -1],edge.distance,configuration)
            for (const key in newScope) {
                result.set(key + "_" +edge.targetInterface,newScope[key])
            }
        });
        }
        return result;
    }

// function to evaluate the output of a vertex
function outputCalculate(scope : Map<string,number>, type : Type, configuration : Configuration): Record<string,number>[]{
    let result: Record<string,number>[] = []
    for (let i = 0; i < type.output; i ++){
        let output: Record<string, number> = {}
        let equation = configuration.equations[type.id][i]
        configuration.parameters.forEach(param => {
            try {
                output[param] = evaluate(equation[param],scope);
            } catch (error) {
                console.error(`Error evaluating equation for ${type.id} and parameter ${param}:`, error);
            }
        }
        )
        result.push(output)
    }
    return result
}

// function to evaluate the graph. It will return a map of vertex id to output values
export function evaluateGraph(graph: Graph, types : Type[], configuration: Configuration): Map<string,Record<string,number>[]>{
    let result = new Map<string,Record<string,number>[]>();
    let graphCopy = createGraph([...graph.vertices], [...graph.edges]) 
    let sorted = topologicalSort(graphCopy)
    let calculateVerticies = sorted.filter(vertexID => graphCopy.vertices.find(v => v.id === vertexID)!.type !== "start")
    calculateVerticies.forEach(vertexID => {
        let vertex = graphCopy.vertices.find(v => v.id === vertexID)!
        let type = types.find(t => t.id === vertex.type)!
        if (type.id !== "end"){
            let inputScope = createInputScope(vertexID,graphCopy,type,configuration)
            let combinedScope = new Map<string, number>(inputScope);
            for (const key in vertex.scope) {
                combinedScope.set(key, vertex.scope[key]);
            }
            let output = outputCalculate(combinedScope, type, configuration)
            graphCopy.vertices.find(v => v.id === vertexID)!.output = output
            result.set(vertexID, output)
        }
        else{
            let output: Record<string, number> = {}
            let inputScope = createInputScope(vertexID,graphCopy,type,configuration)
            configuration.parameters.forEach(param => {
                output[param] = inputScope.get(param)!
            });
            graphCopy.vertices.find(v => v.id === vertexID)!.output = [output]
            result.set(vertexID,[output]);
        }
    })
    return result
}

// function to calculate the freespace in a edge
export function freespaceInEdge(edge: Edge, distance: number, graph: Graph, configuration: Configuration): Record<string,number>{
    let sourceVertex = graph.vertices.find(v => v.id === edge.source)!
    return freespaceCalculate(sourceVertex.output[edge.sourceInterface - 1],distance,configuration)
}