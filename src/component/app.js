import React from 'react';
import moment from 'moment';

export default class Counter extends React.Component{
    constructor(props){
        super(props);
        this.state={
            days:0,
            hrs:0,
            mins:0,
            secs:0,
            dateInput:'',
            timeInput:'',
            ampm:'AM',
            endDate:'',
            modalStyle :{display:'none'},
            countStyle:{display:'none'},
			timer:null,
			errormessage:'',
			errorstyle:{display:'none'},
			infomessage:'',
			infostyle:{display:'none'}
        }
    }

    changeDate=(e)=>{
        this.setState({
            dateInput:e.target.value
        })
    }
    changeTime=(e)=>{
        this.setState({
            timeInput:e.target.value
        })
    }
    changeAmPm=(e)=>{
        this.setState({
            ampm:e.target.value
        })
    }

    openModel=()=>{
        this.setState({
			modalStyle:{display:'block'},
			infomessage:'',
			infostyle:{display:'none'}
        })
    }
    closeModel=()=>{
        this.setState({
            modalStyle:{display:'none'}
		})
		if (this.state.endDate==='')
		{
			this.setState({
				infomessage:'Click the Settings button to set a new countdown.',
				infostyle:{display:'block'}
			})
		}
	}
	
	 
    stopCount=()=>{
        clearInterval(this.state.timer);
        this.setState({
            dateInput:'',
            timeInput:'',
            ampm:'',
            endDate:'',
            countStyle:{display:'none'},
            infomessage:'Countdown ended. Click the Settings button to set a new countdown.',
			infostyle:{display:'block'},
			timer:null
        })
    }
	 
	handleError=()=>{
		this.setState({
			errorstyle:{display:'block'},
			dateInput:'',
			timeInput:'',
			ampm:'AM'
		})
	}

    handleSubmit=(e)=>{
        e.preventDefault();
        let endDate=moment(`${this.state.dateInput} ${this.state.timeInput} ${this.state.ampm}`,'DD-MM-YYYY hh:mm a').format('X');
		if ((endDate-moment().format('X'))<0)
        {
            this.setState({
                errormessage:'The countdown must be set to a future date.',
			})
			this.handleError();
        }
        else if(!moment(`${this.state.dateInput}`,'DD-MM-YYYY',true).isValid())
        {
            this.setState({
                errormessage:'Date input must be a valid date set in MM-DD-YYYY format.',
			});
			this.handleError();
        }
        else if(!moment(`${this.state.timeInput}`,'hh:mm',true).isValid())
        {
            this.setState({
                errormessage:'Time input must be valid according to the 12-hour clock set in hh:mm format.',
			});
			this.handleError();
		}
		else{
			this.setState({
				endDate,
				modalStyle:{display:'none'}
            })
            this.startCount();
		}
        
            
    }

    startCount=()=>{
        let distance;
        clearInterval(this.state.timer);

        this.state.timer=setInterval(()=>{
			distance=this.state.endDate-moment().format('X');
			if (distance>0)
            {
				this.setState({
					days:parseInt(distance/(60*60*24),10),
					hrs:parseInt(distance%(60*60*24)/(60*60),10),
					mins:parseInt(distance%(60*60)/(60),10),
					secs:parseInt(distance%60,10),
					countStyle:{display:'block'},
					infomessage:'',
					infostyle:{display:'none'}
				})
			}
			else{
				this.stopCount();
			}
        });
	};

	componentDidMount(){
		this.setState({
			infomessage:'Click the Settings button to set a new countdown.',
			infostyle:{display:'block'}
		})
	}


	render(){
  		return (
   			<div className="body">
    			<header>
    				<h1>Countdown Timer</h1>
      					<div className="button-group">
                            <button type="button" className="clear" onClick={this.stopCount} disabled={!this.state.timer}>Clear</button>
                    		<button type="button" className="settings" onClick={this.openModel}>Settings</button>
                    	</div>
                </header>
                <main>
                	<div id="modal" style={this.state.modalStyle}>
                    	<div className="modal-content">
                    	<div className="modal-header">Countdown Settings</div>
                    		<div className="modal-body">
                    			<form onSubmit={this.handleSubmit}>
                        			<div className="form-group">
                            			<label htmlFor="date-input">Date:</label>
                            			<input type="text"  value={this.state.dateInput} onChange={this.changeDate} placeholder="DD-MM-YYYY" id="date-input" required/>
                        			</div>
                        			<div className="form-group">
                            			<label htmlFor="time-input">Time:</label>
                            			<input type="text" value={this.state.timeInput} onChange={this.changeTime} placeholder="hh:mm" id="time-input" required/>
                        			</div>
                        			<div className="form-group">
                            			<label htmlFor="ampm-input">AM/PM:</label>
                            			<select value={this.state.ampm} onChange={this.changeAmPm} id="ampm-input">
                                			<option value="AM">AM</option>
                                			<option value="PM">PM</option>
                            			</select>
                        			</div>
									<p className="message error-message" style={this.state.errorstyle}><span className="fa fa-exclamation-circle fa-lg fa-fw"></span> {this.state.errormessage}</p>
                        			<div className="button-group">
                        				<input type="submit" value="Start"></input>
                        				<input type="button" onClick={this.closeModel} value="Cancel"></input>
                        			</div>
                    			</form>
							</div>
                    	</div>
                    </div>
					<Unit   days={this.state.days} hrs={this.state.hrs} 
                            mins={this.state.mins} secs={this.state.secs} 
                            countStyle={this.state.countStyle}
                    />
					<p className="message info-message" style={this.state.infostyle}><span className="fa fa-info-circle fa-lg fa-fw"></span> {this.state.infomessage}</p>
                </main>
                <footer>Created by <a href="https://github.com/giteshchaudhari" target="_blank">Gitesh Chaudhari</a> &copy; {new Date().getFullYear()}</footer>
            </div>
        );
    };
};

const Unit =({days,hrs,mins,secs,countStyle})=>(
    <div  className="countdown" style={countStyle}>
		<div className="card">
        	<div className="countdown-value">days</div>
			<div className="countdown-unit">{days}</div>
		</div>
		<div className="card">
			<div className="countdown-value">hrs</div>
			<div className="countdown-unit">{hrs}</div>
		</div>
		<div className="card">	
			<div className="countdown-value">mins</div>
			<div className="countdown-unit">{mins}</div>
		</div>
		<div className="card">	
			<div className="countdown-value">secs</div>
			<div className="countdown-unit">{secs}</div>
		</div>
    </div>
)
