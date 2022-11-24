import "./App.scss";
import { TaskList } from "./components/TaskList"
import { PageNotFound } from './components/PageNotFound';
import { Routes, Route } from "react-router-dom";


export const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path='/' element={<TaskList />}/>
                <Route path='*' element={<PageNotFound />}/>
            </Routes>
        </div>
    )
}

