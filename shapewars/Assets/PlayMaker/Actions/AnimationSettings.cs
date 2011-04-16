/// <copyright>(c) Hutong Games, LLC. 2010-2011. All rights reserved.</copyright>
/// <history> 
/// Version 1.0 
/// </history>

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Animation)]
	[Tooltip("Set the Wrap Mode, Blend Mode, Layer and Speed of an Animation.\nNOTE: Settings are applied once, on entering the state, NOT continuously. To dynamically control an animation's settings, use Set Animation Speede etc.")]
	public class AnimationSettings : FsmStateAction
	{
		[RequiredField]
		[CheckForComponent(typeof(Animation))]
		public FsmOwnerDefault gameObject;
		[RequiredField]
		[UIHint(UIHint.Animation)]
		public FsmString animName;
		public WrapMode wrapMode;
		public AnimationBlendMode blendMode;
		[HasFloatSlider(0f, 5f)]
		public FsmFloat speed;
		public FsmInt layer;

		public override void Reset()
		{
			gameObject = null;
			animName = null;
			wrapMode = WrapMode.Loop;
			blendMode = AnimationBlendMode.Blend;
			speed = 1.0f;
			layer = 0;
		}

		public override void OnEnter()
		{
			DoAnimationSettings();
			
			Finish();
		}

		void DoAnimationSettings()
		{
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go == null || string.IsNullOrEmpty(animName.Value))
				return;

			if (go.animation == null)
			{
				LogWarning("Missing animation component: " + go.name);
				return;
			}

			AnimationState anim = go.animation[animName.Value];

			if (anim == null)
			{
				LogWarning("Missing animation: " + animName.Value);
				return;
			}

			anim.wrapMode = wrapMode;
			anim.blendMode = blendMode;
			
			if (!layer.IsNone)
				anim.layer = layer.Value;
			
			if (!speed.IsNone)
				anim.speed = speed.Value;
		}
	}
}