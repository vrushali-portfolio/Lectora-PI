function ButtonTrackingObj(exp, titleName, cm, frame){
   this.VarTrivBtnTracking = new Variable( 'VarTrivBtnTracking', null, 0, cm, frame, exp, titleName, true );
   this.title = null;
}

ButtonTrackingObj.codeToStateMap =
{
	'N' : 'normalState',
	'O' : 'overState',
	'D' : 'downState',
	'A' : 'disabledState',
	'V' : 'visitedState',
	'S' : 'selectedState'
};
ButtonTrackingObj.stateToCodeMap = {};
for (var key in ButtonTrackingObj.codeToStateMap)
	ButtonTrackingObj.stateToCodeMap[ButtonTrackingObj.codeToStateMap[key]] = key;

ButtonTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivBtnTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split(',');
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var status = arrStatus[i];
			        var node = this.FindNode( this.title, id );
			        if( node )
						node.v = ButtonTrackingObj.codeToStateMap[status] || status;
		        }
    		}
        }
    } catch (e) { }
}

ButtonTrackingObj.prototype.FindNode = function( node, id )
{
	if( node.id == id )
		return node;
	
	var match = null;
	if( typeof( node.c ) != 'undefined' ){
		for( var i=0; i<node.c.length; i++ ){
			match = this.FindNode( node.c[i], id );
			if( match != null )
				break;
		}
	}
	
	return match;
}

ButtonTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		return 'normalState';
	}
}


ButtonTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );

	return status;
}


ButtonTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
{
	if( node == null )
		return;
	node.v = status;
	if( status == 0 && typeof(node.c)!='undefined')
	{
		for( var i=0; i<node.c.length; i++ )
			this.InternalSetRangeStatus( node.c[i], status ); 
	}
}

ButtonTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

ButtonTrackingObj.prototype.IterateTree = function( func )
{
	var stack = [];
	stack.push( this.title );
	var i = 0;
	while( stack.length > 0 )
	{
		var node = stack.shift();
		
		if( typeof(node.c) != 'undefined' )
			stack = node.c.concat(stack);
			
		//do the thing
		func( node, i, stack );
		i++;
	}	
}

ButtonTrackingObj.prototype.SavePageTracking = function()
{
	var fnIsSaveState = window.ObjButton && ObjButton.isSaveState || function () { return false; };
	var hexString = '';
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree(function(node, i, stack){
		if (fnIsSaveState(node.v))
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
		hexString += (i > 0 ? ',' : '') + arrayIds[i].toString(16);

	hexString += (arrayIds.length > 0 ? '#' : '');
	
	for (var i = 0; i < arrayStatus.length; i++)
		hexString += (i > 0 ? ',' : '') + (ButtonTrackingObj.stateToCodeMap[arrayStatus[i]] || arrayStatus[i]);

	//LD-8267 - Added a condition to avoid tracking null/empty data unnecessarily
	if (hexString.length > 0 || (myTop.suspendDataCache && myTop.suspendDataCache.indexOf('VarTrivBtnTracking') >= 0) || !this.VarTrivBtnTracking.bSCORM)
		this.VarTrivBtnTracking.set(hexString);
}

var trivBtnTracking = new ButtonTrackingObj(365,'endo_pix', 0, null);
trivBtnTracking.title={id:1,v:0,c:[{id:374087,v:'normalState'},{id:374077,v:'normalState'},{id:120952,v:'normalState'},{id:131471,v:'normalState'},{id:131426,v:'normalState'},{id:732684,v:'normalState'},{id:881527,v:'normalState'},{id:884008,v:'normalState'},{id:1213984,v:'normalState'},{id:1213991,v:'normalState'},{id:1213999,v:'normalState'},{id:1767546,v:'normalState'},{id:1767553,v:'normalState'},{id:1767561,v:'normalState'},{id:1767615,v:'normalState'},{id:1767622,v:'normalState'},{id:1767630,v:'normalState'},{id:1767808,v:'normalState'},{id:1767815,v:'normalState'},{id:1767823,v:'normalState'},{id:1767777,v:'normalState'},{id:1767784,v:'normalState'},{id:1767792,v:'normalState'},{id:1767746,v:'normalState'},{id:1767753,v:'normalState'},{id:1767761,v:'normalState'},{id:1768059,v:'normalState'},{id:1768066,v:'normalState'},{id:1768074,v:'normalState'},{id:1768153,v:'normalState'},{id:1768160,v:'normalState'},{id:1768168,v:'normalState'},{id:1768218,v:'normalState'},{id:1768225,v:'normalState'},{id:1768233,v:'normalState'},{id:1836736,v:'normalState'},{id:1768351,v:'normalState'},{id:1768364,v:'normalState'},{id:1768371,v:'normalState'},{id:1768322,v:'normalState'},{id:1768335,v:'normalState'},{id:1768342,v:'normalState'},{id:1805427,v:'normalState'},{id:1805434,v:'normalState'},{id:1805442,v:'normalState'},{id:1805396,v:'normalState'},{id:1805403,v:'normalState'},{id:1805411,v:'normalState'},{id:1805365,v:'normalState'},{id:1805372,v:'normalState'},{id:1805380,v:'normalState'},{id:1835433,v:'normalState'},{id:1805334,v:'normalState'},{id:1805341,v:'normalState'},{id:1805349,v:'normalState'},{id:1835153,v:'normalState'},{id:1805303,v:'normalState'},{id:1805310,v:'normalState'},{id:1805318,v:'normalState'},{id:1805268,v:'normalState'},{id:1805281,v:'normalState'},{id:1805288,v:'normalState'},{id:1805239,v:'normalState'},{id:1805252,v:'normalState'},{id:1805259,v:'normalState'},{id:1805210,v:'normalState'},{id:1805223,v:'normalState'},{id:1805230,v:'normalState'},{id:1805690,v:'normalState'},{id:1805697,v:'normalState'},{id:1805705,v:'normalState'},{id:1836892,v:'normalState'},{id:1805659,v:'normalState'},{id:1805666,v:'normalState'},{id:1805674,v:'normalState'},{id:1837192,v:'normalState'},{id:1817677,v:'normalState'},{id:1817684,v:'normalState'},{id:1817692,v:'normalState'},{id:1805628,v:'normalState'},{id:1805635,v:'normalState'},{id:1805643,v:'normalState'},{id:1805887,v:'normalState'},{id:1805894,v:'normalState'},{id:1805902,v:'normalState'},{id:1837282,v:'normalState'},{id:1805856,v:'normalState'},{id:1805863,v:'normalState'},{id:1805871,v:'normalState'},{id:1805825,v:'normalState'},{id:1805832,v:'normalState'},{id:1805840,v:'normalState'},{id:1815361,v:'normalState'},{id:1815374,v:'normalState'},{id:1815381,v:'normalState'},{id:1815332,v:'normalState'},{id:1815345,v:'normalState'},{id:1815352,v:'normalState'},{id:1359198,v:'normalState'},{id:1359189,v:'normalState'},{id:1607303,v:'normalState'},{id:1607294,v:'normalState'},{id:1663179,v:'normalState'},{id:1806201,v:'normalState'},{id:1806208,v:'normalState'},{id:1806216,v:'normalState'},{id:1806170,v:'normalState'},{id:1806177,v:'normalState'},{id:1806185,v:'normalState'},{id:1806135,v:'normalState'},{id:1806148,v:'normalState'},{id:1806155,v:'normalState'},{id:1806106,v:'normalState'},{id:1806119,v:'normalState'},{id:1806126,v:'normalState'},{id:1806077,v:'normalState'},{id:1806090,v:'normalState'},{id:1806097,v:'normalState'},{id:1806687,v:'normalState'},{id:1806694,v:'normalState'},{id:1806702,v:'normalState'},{id:1806656,v:'normalState'},{id:1806663,v:'normalState'},{id:1806671,v:'normalState'},{id:1806625,v:'normalState'},{id:1806632,v:'normalState'},{id:1806640,v:'normalState'},{id:1806594,v:'normalState'},{id:1806601,v:'normalState'},{id:1806610,v:'normalState'},{id:1806565,v:'normalState'},{id:1806572,v:'normalState'},{id:1806581,v:'normalState'},{id:1806942,v:'normalState'},{id:1806949,v:'normalState'},{id:1806957,v:'normalState'},{id:1806911,v:'normalState'},{id:1806918,v:'normalState'},{id:1806926,v:'normalState'},{id:1806880,v:'normalState'},{id:1806887,v:'normalState'},{id:1806896,v:'normalState'},{id:1806851,v:'normalState'},{id:1806858,v:'normalState'},{id:1806867,v:'normalState'},{id:1807014,v:'normalState'},{id:1807021,v:'normalState'},{id:1807029,v:'normalState'},{id:1807392,v:'normalState'},{id:1807399,v:'normalState'},{id:1807407,v:'normalState'},{id:1807361,v:'normalState'},{id:1807368,v:'normalState'},{id:1807376,v:'normalState'},{id:1807330,v:'normalState'},{id:1807337,v:'normalState'},{id:1807345,v:'normalState'},{id:1807295,v:'normalState'},{id:1807308,v:'normalState'},{id:1807315,v:'normalState'},{id:1807266,v:'normalState'},{id:1807279,v:'normalState'},{id:1807286,v:'normalState'},{id:1807237,v:'normalState'},{id:1807250,v:'normalState'},{id:1807257,v:'normalState'},{id:1807705,v:'normalState'},{id:1807712,v:'normalState'},{id:1807720,v:'normalState'},{id:1807670,v:'normalState'},{id:1807683,v:'normalState'},{id:1807690,v:'normalState'},{id:1807641,v:'normalState'},{id:1807654,v:'normalState'},{id:1807661,v:'normalState'},{id:1807612,v:'normalState'},{id:1807625,v:'normalState'},{id:1807632,v:'normalState'},{id:1807583,v:'normalState'},{id:1807596,v:'normalState'},{id:1807603,v:'normalState'},{id:1808934,v:'normalState'},{id:1808941,v:'normalState'},{id:1808949,v:'normalState'},{id:1363792,v:'normalState'},{id:1363801,v:'normalState'},{id:1364228,v:'normalState'},{id:1364237,v:'normalState'},{id:1252818,v:'normalState'},{id:1364536,v:'normalState'},{id:1364545,v:'normalState'},{id:1778541,v:'normalState'},{id:1778550,v:'normalState'},{id:1778446,v:'normalState'},{id:1807975,v:'normalState'},{id:1807982,v:'normalState'},{id:1807990,v:'normalState'},{id:1807944,v:'normalState'},{id:1807951,v:'normalState'},{id:1807959,v:'normalState'},{id:1807913,v:'normalState'},{id:1807920,v:'normalState'},{id:1807929,v:'normalState'},{id:1808350,v:'normalState'},{id:1808357,v:'normalState'},{id:1808365,v:'normalState'},{id:1808319,v:'normalState'},{id:1808326,v:'normalState'},{id:1808334,v:'normalState'},{id:1808288,v:'normalState'},{id:1808295,v:'normalState'},{id:1808304,v:'normalState'},{id:1808259,v:'normalState'},{id:1808266,v:'normalState'},{id:1808275,v:'normalState'},{id:1808230,v:'normalState'},{id:1808237,v:'normalState'},{id:1808246,v:'normalState'},{id:1808201,v:'normalState'},{id:1808208,v:'normalState'},{id:1808217,v:'normalState'},{id:1808791,v:'normalState'},{id:1808798,v:'normalState'},{id:1808807,v:'normalState'},{id:1808762,v:'normalState'},{id:1808769,v:'normalState'},{id:1808778,v:'normalState'},{id:1808733,v:'normalState'},{id:1808740,v:'normalState'},{id:1808749,v:'normalState'},{id:1808704,v:'normalState'},{id:1808711,v:'normalState'},{id:1808720,v:'normalState'},{id:1808675,v:'normalState'},{id:1808682,v:'normalState'},{id:1808691,v:'normalState'},{id:1808646,v:'normalState'},{id:1808653,v:'normalState'},{id:1808662,v:'normalState'},{id:1808617,v:'normalState'},{id:1808624,v:'normalState'},{id:1808633,v:'normalState'},{id:1809005,v:'normalState'},{id:1809012,v:'normalState'},{id:1809020,v:'normalState'},{id:1809327,v:'normalState'},{id:1809334,v:'normalState'},{id:1809342,v:'normalState'},{id:1809296,v:'normalState'},{id:1809303,v:'normalState'},{id:1809311,v:'normalState'},{id:1809265,v:'normalState'},{id:1809272,v:'normalState'},{id:1809280,v:'normalState'},{id:1833317,v:'normalState'},{id:1809234,v:'normalState'},{id:1809241,v:'normalState'},{id:1809249,v:'normalState'},{id:1809458,v:'normalState'},{id:1809473,v:'normalState'},{id:1809480,v:'normalState'},{id:1809433,v:'normalState'},{id:1809440,v:'normalState'},{id:1809448,v:'normalState'},{id:1809598,v:'normalState'},{id:1809605,v:'normalState'},{id:1809613,v:'normalState'},{id:1809567,v:'normalState'},{id:1809574,v:'normalState'},{id:1809582,v:'normalState'},{id:1832810,v:'normalState'},{id:1809713,v:'normalState'},{id:1809720,v:'normalState'},{id:1809728,v:'normalState'},{id:1809845,v:'normalState'},{id:1809852,v:'normalState'},{id:1809860,v:'normalState'},{id:1832274,v:'normalState'},{id:1832281,v:'normalState'},{id:1832289,v:'normalState'},{id:309644,v:'normalState'},{id:492599,v:'normalState'},{id:493081,v:'normalState'},{id:946531,v:'normalState'},{id:946539,v:'normalState'},{id:875414,v:'normalState'},{id:875422,v:'normalState'},{id:650188,v:'normalState'},{id:650199,v:'normalState'},{id:963763,v:'normalState'},{id:963774,v:'normalState'},{id:163764,v:'normalState'},{id:1597770,v:'normalState'},{id:164964,v:'normalState'},{id:1581935,v:'normalState'},{id:1584033,v:'normalState'},{id:164971,v:'normalState'},{id:842280,v:'normalState'},{id:164978,v:'normalState'},{id:164985,v:'normalState'},{id:638508,v:'normalState'},{id:1600169,v:'normalState'},{id:1600160,v:'normalState'},{id:640179,v:'normalState'},{id:640187,v:'normalState'},{id:638897,v:'normalState'},{id:1600609,v:'normalState'},{id:1600600,v:'normalState'},{id:1567416,v:'normalState'},{id:1601119,v:'normalState'},{id:1601110,v:'normalState'},{id:165817,v:'normalState'},{id:165828,v:'normalState'},{id:1601631,v:'normalState'},{id:167603,v:'normalState'},{id:674762,v:'normalState'},{id:688658,v:'normalState'},{id:751401,v:'normalState'},{id:363581,v:'normalState'},{id:363594,v:'normalState'},{id:363607,v:'normalState'},{id:363620,v:'normalState'},{id:363631,v:'normalState'},{id:363644,v:'normalState'},{id:363657,v:'normalState'},{id:363670,v:'normalState'},{id:363681,v:'normalState'},{id:363694,v:'normalState'},{id:363707,v:'normalState'},{id:363720,v:'normalState'},{id:363731,v:'normalState'},{id:363744,v:'normalState'},{id:363757,v:'normalState'},{id:363770,v:'normalState'},{id:363783,v:'normalState'},{id:363796,v:'normalState'},{id:363809,v:'normalState'},{id:363820,v:'normalState'},{id:363833,v:'normalState'},{id:363846,v:'normalState'},{id:363859,v:'normalState'},{id:363870,v:'normalState'},{id:363883,v:'normalState'},{id:363896,v:'normalState'},{id:363909,v:'normalState'}]};
