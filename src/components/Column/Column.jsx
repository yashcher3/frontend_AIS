import Task from "../Task/Task"
import "./Column.css"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"


export default function Colunn ({tasks}){
    return (
        <>
        <div className="column">
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (<Task id={task.id} title={task.title} key={task.id}/>))}
            </SortableContext>
        </div>
        </>
    )
}