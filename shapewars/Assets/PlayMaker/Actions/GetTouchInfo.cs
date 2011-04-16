// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Device)]
	[Tooltip("Gets info on a touch event.")]
	public class GetTouchInfo : FsmStateAction
	{
		public FsmInt fingerId;
		public FsmBool normalize;
		[UIHint(UIHint.Variable)]
		public FsmVector3 storePosition;
		[UIHint(UIHint.Variable)]
		public FsmFloat storeX;
		[UIHint(UIHint.Variable)]
		public FsmFloat storeY;
		[UIHint(UIHint.Variable)]
		public FsmVector3 storeDeltaPosition;
		[UIHint(UIHint.Variable)]
		public FsmFloat storeDeltaX;
		[UIHint(UIHint.Variable)]
		public FsmFloat storeDeltaY;
		[UIHint(UIHint.Variable)]
		public FsmFloat storeDeltaTime;
		[UIHint(UIHint.Variable)]
		public FsmInt storeTapCount;
		
		float screenWidth;
		float screenHeight;
		
		public override void Reset()
		{
			fingerId = new FsmInt { UseVariable = true };
			normalize = true;
			storePosition = null;
			storeDeltaPosition = null;
			storeDeltaTime = null;
			storeTapCount = null;
		}
		
		public override void OnEnter()
		{
			screenWidth = (float)Screen.width;
			screenHeight = (float)Screen.height;
		}
		
		public override void OnUpdate()
		{
			DoGetTouchInfo();
		}
		
		void DoGetTouchInfo()
		{
			if (Input.touchCount > 0)
			{
				foreach (var touch in Input.touches)
				{
					if (fingerId.IsNone || touch.fingerId == fingerId.Value)
					{
						float x = normalize.Value == false ? touch.position.x : touch.position.x / screenWidth;
						float y = normalize.Value == false ? touch.position.y : touch.position.y / screenHeight;
						
						if (!storePosition.IsNone)
						{
							storePosition.Value = new Vector3(x, y, 0);
						}
						
						storeX.Value = x;
						storeY.Value = y;

						float deltax = normalize.Value == false ? touch.deltaPosition.x : touch.deltaPosition.x / screenWidth;
						float deltay = normalize.Value == false ? touch.deltaPosition.y : touch.deltaPosition.y / screenHeight;
						
						if (!storeDeltaPosition.IsNone)
						{
							storeDeltaPosition.Value = new Vector3(deltax, deltay, 0);
						}
						
						storeDeltaX.Value = x;
						storeDeltaY.Value = y;
						
						storeDeltaTime.Value = touch.deltaTime;
						storeTapCount.Value = touch.tapCount;
					}
				}
			}
		}
		
		
	}
}