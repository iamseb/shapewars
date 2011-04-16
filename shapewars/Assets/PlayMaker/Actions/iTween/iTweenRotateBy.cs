// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory("iTween")]
	[Tooltip("Multiplies supplied values by 360 and rotates a GameObject by calculated amount over time.")]
	public class iTweenRotateBy : iTweenFsmAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[RequiredField]
		[Tooltip("A vector that will multiply current GameObjects rotation.")]
		public FsmVector3 vector;
		[Tooltip("The time in seconds the animation will take to complete.")]
		public FsmFloat time;
		[Tooltip("The time in seconds the animation will wait before beginning.")]
		public FsmFloat delay;
		[Tooltip("Can be used instead of time to allow animation based on speed. When you define speed the time variable is ignored.")]
		public FsmFloat speed;
		[Tooltip("For the shape of the easing curve applied to the animation.")]
		public iTween.EaseType easeType = iTween.EaseType.linear;
		[Tooltip("The type of loop to apply once the animation has completed.")]
		public iTween.LoopType loopType = iTween.LoopType.none;
		
		public Space space = Space.World;
		
		public override void Reset()
		{
			base.Reset();
			time = 1f;
			delay = 0f;
			loopType = iTween.LoopType.none;
			vector = new FsmVector3 { UseVariable = true };
			speed = new FsmFloat { UseVariable = true };
			space = Space.World;
		}

		public override void OnEnter()
		{
			base.OnEnteriTween(gameObject);
			if(loopType != iTween.LoopType.none) base.IsLoop(true);
			DoiTween();	
		}
		
		public override void OnExit(){
			base.OnExitiTween(gameObject);
		}
		
		void DoiTween()
		{
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go == null) return;
			// init position
			
			Vector3 amount = Vector3.zero;
			if (vector.IsNone) { 
				
			} else {
				amount = vector.Value;
			}
			
			itweenType = "rotate";
			iTween.RotateBy(go, iTween.Hash(
			                              "amount", amount,
			                              speed.IsNone ? "time" : "speed", speed.IsNone ? time.IsNone ? 1f : time.Value : speed.Value,
			                              "delay", delay.IsNone ? 0f : delay.Value,
			                              "easetype", easeType,
			                              "looptype", loopType,
			                              "oncomplete", "iTweenOnComplete",
			                              "oncompleteparams", itweenID,
			                              "onstart", "iTweenOnStart",
			                              "onstartparams", itweenID,
			                              "ignoretimescale", realTime.IsNone ? false : realTime.Value,
			                              "space", space  
			                              ));
			}
	}
}