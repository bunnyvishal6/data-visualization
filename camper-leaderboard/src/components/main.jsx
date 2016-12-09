import React from 'react';
import marked from 'marked';

export default class Application extends React.Component {
    constructor() {
        super();
        this.state = {
            recent: null,
            alltime: null,
            current: 'recent'
        }
    }

    createMarkup(elements) {
        return { __html: elements };
    }

    caretDown(current){
        if(this.state.current === current){
            return (<span className='glyphicon glyphicon-triangle-bottom'></span>);
        } 
    }

    handleClick(e){
        if(e.currentTarget.textContent == 'Points in past 30 days'){
            this.setState({current: 'recent'});
        } else if(e.currentTarget.textContent == 'Alltime'){
            this.setState({current: 'alltime'});
        }
    }

    makeTableElements(data) {
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push(
                <tr key={i}>
                    <td className='text-center' width='5%'>{i + 1}</td>
                    <td width='45%'><img src={data[i].img} className='img img-rounded img-responsive' /><a href={`https://www.freecodecamp.com/${data[i].username}`} target='_blank'>{data[i].username}</a></td>
                    <td className='text-center' width='25%'>{data[i].recent}</td>
                    <td className='text-center' width='25%'>{data[i].alltime}</td>
                </tr>
            );
            if (i == data.length - 1) {
                return array;
            }
        }
    }

    componentDidMount() {
        fetch('https://fcctop100.herokuapp.com/api/fccusers/top/recent')
            .then(data => data.json()).then(recent => {
                fetch('https://fcctop100.herokuapp.com/api/fccusers/top/alltime')
                    .then(response => response.json()).then(alltime => {
                        recent = this.makeTableElements(recent);
                        alltime = this.makeTableElements(alltime);
                        this.setState({ recent: recent, alltime: alltime });
                    })
            })
    }

    render() {
        return (
            <div className='container'>
                <h2 className='text-center text-success'>Camper Leaderboard</h2>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr className='text-primary'>
                            <th width='5%'>Rank</th>
                            <th width='45%'>Camper Name</th>
                            <th width='25%'><span onClick={this.handleClick.bind(this)} className='data'>Points in past 30 days</span> {this.caretDown('recent')} </th>
                            <th width='25%'><span onClick={this.handleClick.bind(this)} className='data'>Alltime</span> {this.caretDown('alltime')} </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state[this.state.current]}
                    </tbody>
                </table>
            </div>
        );
    }
}